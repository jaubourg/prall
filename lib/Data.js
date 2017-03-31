"use strict";

const Args = require( `./Args` );
const Context = require( `./Context` );

const getFunction = ( context, method ) => {
    if ( typeof method === `function` ) {
        return method;
    }
    const name = String( method );
    if ( context == null ) {
        throw new Error( `method ${ name } of ${ context } does not exist` );
    }
    const func = context[ name ];
    if ( typeof func !== `function` ) {
        throw new Error( `context[${ name }] is not a function` );
    }
    return func;
};

class Data {
    constructor( data ) {
        if ( data ) {
            this.adapt = data.adapt;
            this.args = new Args( data.args );
            this.context = new Context( data.context );
            this.method = data.method;
        }
    }
    call( moreArgs ) {
        return new Promise( ( resolve, reject ) => {
            const context = this.context.get();
            const func = getFunction( context, this.method );
            const { adapt, args } = this;
            const actualArgs = args.with( moreArgs );
            let argsArray = actualArgs.toArray();
            if ( adapt ) {
                argsArray = argsArray.concat( [ ( ...callbackArgs ) => {
                    try {
                        const [ error, success ] = adapt( ...callbackArgs );
                        if ( error ) {
                            reject( error );
                        } else {
                            resolve( success );
                        }
                    } catch ( e ) {
                        reject( e );
                    }
                } ] );
            }
            const returned = func.apply( context, argsArray );
            if ( !adapt ) {
                resolve( returned );
            }
        } );
    }
    clone( key, value ) {
        const clone = new Data();
        clone.adapt = this.adapt;
        clone.args = this.args;
        clone.context = this.context;
        clone.method = this.method;
        clone[ key ] = value;
        return clone;
    }
    withAdapt( adapt ) {
        if ( !this.adapt ) {
            throw new Error( `cannot filter non-adapted prall functions` );
        }
        const type = typeof adapt;
        if ( type !== `function` ) {
            throw new Error( `function expected, ${ type } provided` );
        }
        return this.adapt === adapt ? this : this.clone( `adapt`, adapt );
    }
    withArgs( args ) {
        const newArgs = this.args.with( args );
        return this.args === newArgs ? this : this.clone( `args`, newArgs );
    }
    withContext( context, locked ) {
        const newContext = this.context.set( context, locked );
        return this.context === newContext ? this : this.clone( `context`, newContext );
    }
}

module.exports = Data;
