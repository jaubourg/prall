"use strict";

const Data = require( `./Data` );
const Prall = require( `./Prall` );

const createPrall = ( method, args, filter ) => {
    const type = typeof method;
    if ( ( type !== `function` ) && ( type !== `string` ) ) {
        throw new Error( `function or string expected, ${ type } provided` );
    }
    if ( method instanceof Prall ) {
        if ( filter ) {
            throw new Error( `prall functions cannot be adapted` );
        }
        return method.with( ...args );
    }
    return new Prall( new Data( {
        "adapt": filter,
        args,
        method,
    } ) );
};

const ident = ( ...x ) => x;

const prall = ( method, ...args ) => createPrall( method, args );
const adapt = ( method, ...args ) => createPrall( method, args, ident );

const { placeholder } = require( `./Args` );

prall.placeholder = placeholder;
prall._ = placeholder;
adapt.placeholder = placeholder;
adapt._ = placeholder;

prall.adapt = adapt;
prall.prall = prall;

Object.freeze( adapt );
Object.freeze( prall );

module.exports = prall;
