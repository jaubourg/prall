"use strict";

const createPrall = require( `./createPrall` );

const prall = ( method, ...args ) => createPrall( method, args );
const adapt = ( method, ...args ) => createPrall( method, args, true );

adapt.adapt = adapt;
adapt.prall = prall;
prall.adapt = adapt;
prall.prall = prall;

const Placeholder = require( `./Placeholder` );
const classFactory = filter => class extends Placeholder {
    constructor( ...args ) {
        super( filter, ...args );
    }
};

const UnfilteredPlaceholder = classFactory( x => x );
UnfilteredPlaceholder.classFactory = classFactory;
UnfilteredPlaceholder.Filtered = Placeholder;

const placeholder = new UnfilteredPlaceholder();

adapt._ = placeholder;
adapt.Placeholder = UnfilteredPlaceholder;

prall._ = placeholder;
prall.Placeholder = UnfilteredPlaceholder;

Object.freeze( adapt );
Object.freeze( prall );
Object.freeze( UnfilteredPlaceholder );

module.exports = prall;
