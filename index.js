"use strict";

const placeholder = {};

const concat = ( array1, array2, toFill ) => {
    if ( !toFill && ( !array2 || !array2.length ) ) {
        return array1;
    }
    let output;
    let index2 = 0;
    for ( let index1 = 0; index1 < array1.length; index1++ ) {
        let item = array1[ index1 ];
        if ( item === placeholder ) {
            if ( array2 && ( index2 < array2.length ) ) {
                if ( !output ) {
                    output = array1.slice( 0, index1 );
                }
                item = array2[ index2++ ];
            } else if ( toFill ) {
                throw new Error( `missing arguments` );
            }
        }
        if ( output ) {
            output.push( item );
        }
    }
    if ( !array2 || ( index2 >= array2.length ) ) {
        return output || array1;
    }
    if ( !output ) {
        output = array1.slice();
    }
    for ( ; index2 < array2.length; index2++ ) {
        const item = array2[ index2 ];
        if ( toFill && ( item === placeholder ) ) {
            throw new Error( `missing arguments` );
        }
        output.push( item );
    }
    return output;
};

class Data {
    constructor( ...dataObjects ) {
        for ( const data of dataObjects ) {
            for ( const key of Object.keys( data ) ) {
                this[ key ] = data[ key ];
            }
        }
    }
    call( moreArgs ) {
        return new Promise( ( resolve, reject ) => {
            const { adapt, args, context } = this;
            const func = this.getFunction();
            let actualArgs = concat( args, moreArgs, true );
            if ( adapt ) {
                if ( actualArgs === args ) {
                    actualArgs = args.slice();
                }
                actualArgs.push( ( ...callbackArgs ) => {
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
                } );
            }
            const returned = func.apply( context, actualArgs );
            if ( !adapt ) {
                resolve( returned );
            }
        } );
    }
    getFunction() {
        const { context, method } = this;
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
    }
    with( ...dataObjects ) {
        return new Data( this, ...dataObjects );
    }
}

const dataMap = new WeakMap();

class ExtensibleFunction extends Function {
    constructor( func ) {
        return Object.setPrototypeOf( func, new.target.prototype );
    }
}

class Prall extends ExtensibleFunction {
    constructor( data ) {
        super( ( ...args ) => data.call( args ) );
        dataMap.set( this, data );
    }
    apply( context, args ) {
        const data = dataMap.get( this );
        return (
            data.contextLocked || ( data.context === context ) ?
                data :
                data.with( {
                    context,
                } )
        ).call( args );
    }
    bind( context ) {
        const data = dataMap.get( this );
        return data.contextLocked || ( data.context === context ) ? this : new Prall( data.with( {
            context,
            "contextLocked": true,
        } ) );
    }
    call( context, ...args ) {
        return this.apply( context, args );
    }
    catch( handler ) {
        return this().catch( handler );
    }
    filter( adapt ) {
        const data = dataMap.get( this );
        if ( !data.adapt ) {
            throw new Error( `cannot filter non-adapted prall instance` );
        }
        const type = typeof adapt;
        if ( type !== `function` ) {
            throw new Error( `function expected, ${ type } provided` );
        }
        return data.adpat === adapt ? this : new Prall( data.with( {
            adapt,
        } ) );
    }
    on( context ) {
        const data = dataMap.get( this );
        return data.contextLocked || ( data.context === context ) ? this : new Prall( data.with( {
            context,
        } ) );
    }
    then( resolveHandler, rejectHandler ) {
        return this().then( resolveHandler, rejectHandler );
    }
    with( ...args ) {
        if ( !args.length ) {
            return this;
        }
        const data = dataMap.get( this );
        return new Prall( data.with( {
            "args": concat( data.args, args ),
        } ) );
    }
}

const createPrall = ( method, args, adapt ) => {
    const type = typeof method;
    if ( ( type !== `function` ) && ( type !== `string` ) ) {
        throw new Error( `function or string expected, ${ type } provided` );
    }
    return method instanceof Prall ?
        method.with( ...args ) :
        new Prall( new Data( {
            adapt,
            args,
            method,
        } ) );
};

const ident = ( ...x ) => x;

const prall = ( method, ...args ) => createPrall( method, args );
prall.adapt = ( method, ...args ) => createPrall( method, args, ident );
prall._ = placeholder;

Object.freeze( prall );
Object.freeze( placeholder );

module.exports = prall;
