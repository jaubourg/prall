"use strict";

const { newInstance } = require( `./Prall` );

const ident = ( ...x ) => x;

const prall = ( method, ...args ) => newInstance( {
    "adapt": undefined,
    args,
    "context": undefined,
    method,
} );
const adapt = ( method, ...args ) => newInstance( {
    "adapt": ident,
    args,
    "context": undefined,
    method,
} );

adapt.adapt = adapt;
adapt.prall = prall;
prall.adapt = adapt;
prall.prall = prall;

const { placeholder } = require( `./Args` );

prall.placeholder = placeholder;
prall._ = placeholder;
adapt.placeholder = placeholder;
adapt._ = placeholder;

Object.freeze( adapt );
Object.freeze( prall );

module.exports = prall;
