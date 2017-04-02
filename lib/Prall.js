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

const adaptSymbol = Symbol( `prall-adapt` );
const argsSymbol = Symbol( `prall-args` );
const callSymbol = Symbol( `prall-call` );
const contextSymbol = Symbol( `prall-context` );
const methodSymbol = Symbol( `prall-method` );

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
            let argsArray = this[ argsSymbol ].add( callArgs ).toArray();
            const adapt = this[ adaptSymbol ];
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
        const newArgs = thisArgs.add( args );
        return newArgs === thisArgs ? this : new Prall( this, argsSymbol, newArgs );
    }
}

const Args = require( `./Args` );
const Context = require( `./Context` );

Prall.newInstance = ( { adapt, args, context, method } ) => {
    const type = typeof method;
    if ( ( type !== `function` ) && ( type !== `string` ) ) {
        throw new Error( `function or string expected, ${ type } provided` );
    }
    if ( method instanceof Prall ) {
        if ( adapt ) {
            throw new Error( `prall functions cannot be adapted` );
        }
        return method.with( ...args );
    }
    const instance = new Prall();
    instance[ adaptSymbol ] = adapt;
    instance[ argsSymbol ] = new Args( args );
    instance[ contextSymbol ] = new Context( context );
    instance[ methodSymbol ] = method;
    return instance;
};

module.exports = Prall;
