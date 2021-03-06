"use strict";

const getFunction = ( context, method ) => {
    if ( typeof method === `function` ) {
        return method;
    }
    if ( context == null ) {
        throw new Error( `method ${ method } of ${ context } does not exist` );
    }
    const func = context[ method ];
    if ( typeof func !== `function` ) {
        throw new Error( `context[${ method }] is not a function` );
    }
    return func;
};

class ExtensibleFunction extends Function {
    constructor( func ) {
        return Object.setPrototypeOf( func, new.target.prototype );
    }
}

const adaptSymbol = Symbol( `adapt` );
const argsSymbol = Symbol( `args` );
const callSymbol = Symbol( `call` );
const contextSymbol = Symbol( `context` );
const methodSymbol = Symbol( `method` );

class Prall extends ExtensibleFunction {
    constructor( prall, symbol, value ) {
        super( ( ...callArgs ) => this[ callSymbol ]( callArgs ) );
        if ( prall ) {
            this[ adaptSymbol ] = prall[ adaptSymbol ];
            this[ argsSymbol ] = prall[ argsSymbol ];
            this[ contextSymbol ] = prall[ contextSymbol ];
            this[ methodSymbol ] = prall[ methodSymbol ];
            this[ symbol ] = value;
        }
    }
    [ callSymbol ]( callArgs ) {
        return new Promise( ( resolve, reject ) => {
            const context = this[ contextSymbol ].get();
            const func = getFunction( context, this[ methodSymbol ] );
            const args = this[ argsSymbol ].concat( callArgs ).toArray();
            const adapt = this[ adaptSymbol ];
            if ( adapt ) {
                func.call( context, ...args, ( ...callbackArgs ) => {
                    try {
                        const [ error, success ] = adapt === true ? callbackArgs : adapt( ...callbackArgs );
                        if ( error ) {
                            reject( error );
                        } else {
                            resolve( success );
                        }
                    } catch ( e ) {
                        reject( e );
                    }
                } );
            } else {
                resolve( func.apply( context, args ) );
            }
        } );
    }
    apply( context, args ) {
        return this.on( context )[ callSymbol ]( args );
    }
    bind( context ) {
        const thisContext = this[ contextSymbol ];
        const newContext = thisContext.set( context, true );
        return newContext === thisContext ? this : new Prall( this, contextSymbol, newContext );
    }
    call( context, ...args ) {
        return this.on( context )[ callSymbol ]( args );
    }
    cap( number ) {
        if ( arguments.length ) {
            const type = typeof number;
            if ( type !== `number` ) {
                throw new Error( `number expected, ${ type } provided` );
            }
            if ( number < 0 ) {
                throw new Error( `cannot cap with a negative number expected (${ number } provided)` );
            }
        }
        const thisArgs = this[ argsSymbol ];
        const newArgs = thisArgs.cap( number || 0 );
        return newArgs === thisArgs ? this : new Prall( this, argsSymbol, newArgs );
    }
    catch( handler ) {
        return this().catch( handler );
    }
    filter( newAdapt ) {
        const thisAdapt = this[ adaptSymbol ];
        if ( !thisAdapt ) {
            throw new Error( `cannot filter non-adapted prall functions` );
        }
        const type = typeof newAdapt;
        if ( type !== `function` ) {
            throw new Error( `function expected, ${ type } provided` );
        }
        return newAdapt === thisAdapt ? this : new Prall( this, adaptSymbol, newAdapt );
    }
    on( context ) {
        const thisContext = this[ contextSymbol ];
        const newContext = thisContext.set( context );
        return newContext === thisContext ? this : new Prall( this, contextSymbol, newContext );
    }
    then( resolveHandler, rejectHandler ) {
        return this().then( resolveHandler, rejectHandler );
    }
    with( ...args ) {
        const thisArgs = this[ argsSymbol ];
        const newArgs = thisArgs.concat( args );
        return newArgs === thisArgs ? this : new Prall( this, argsSymbol, newArgs );
    }
}

const createArgs = require( `./createArgs` );
const createContext = require( `./createContext` );

module.exports = ( method, args, adapt ) => {
    const type = typeof method;
    if ( type === `function` ) {
        if ( method instanceof Prall ) {
            if ( adapt ) {
                throw new Error( `prall functions cannot be adapted` );
            }
            return method.with( ...args );
        }
    } else if ( type !== `string` ) {
        throw new Error( `function or string expected, ${ type } provided` );
    }
    const instance = new Prall();
    instance[ adaptSymbol ] = adapt;
    instance[ argsSymbol ] = createArgs( args );
    instance[ contextSymbol ] = createContext();
    instance[ methodSymbol ] = method;
    return instance;
};
