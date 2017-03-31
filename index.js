"use strict";

const concat = ( array1, array2 ) => {
    if ( !array1 || !array1.length ) {
        return array2;
    }
    return array2 && array2.length ? array1.concat( array2 ) : array1;
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
            if ( adapt ) {
                // eslint-disable-next-line no-param-reassign
                moreArgs = moreArgs || [];
                moreArgs.push( ( ...callbackArgs ) => {
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
            const returned = func.apply( context, concat( args, moreArgs ) );
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

module.exports = prall;
