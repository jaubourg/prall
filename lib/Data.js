"use strict";

const concat = require( `./concat` );

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

module.exports = Data;
