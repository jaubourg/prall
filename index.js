"use strict";

const Data = require( `./lib/Data` );
const { placeHolder } = require( `./lib/Args` );
const Prall = require( `./lib/Prall` );

const createPrall = ( method, args, adapt ) => {
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
    return new Prall( new Data( {
        adapt,
        args,
        method,
    } ) );
};

const ident = ( ...x ) => x;

const prall = ( method, ...args ) => createPrall( method, args );
prall.adapt = ( method, ...args ) => createPrall( method, args, ident );
prall._ = placeHolder;

Object.freeze( prall );

module.exports = prall;
