"use strict";

const prall = require( `..` );

module.exports = ( tests, prallParam, adaptParam ) => {
    const output = {};
    for ( const name of Object.keys( tests ) ) {
        output[ name ] = tests[ name ]( prall, prallParam );
        output[ `${ name } (adapt)` ] = tests[ name ]( prall.adapt, adaptParam );
    }
    return output;
};
