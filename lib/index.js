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

const Placeholder = require( `./Placeholder` );
const placeholder = new Placeholder();

adapt._ = placeholder;
adapt.placeholder = placeholder;
adapt.Placeholder = Placeholder;

prall._ = placeholder;
prall.placeholder = placeholder;
prall.Placeholder = Placeholder;

Object.freeze( adapt );
Object.freeze( prall );

module.exports = prall;
