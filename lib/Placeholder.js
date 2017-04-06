"use strict";

const hasDefaultSymbol = Symbol( `hasDefault` );
const defaultSymbol = Symbol( `default` );
const filterSymbol = Symbol( `filter` );

class Placeholder {
    constructor( filter, value ) {
        if ( ( this[ hasDefaultSymbol ] = ( arguments.length > 1 ) ) ) {
            this[ defaultSymbol ] = filter( value );
        }
        this[ filterSymbol ] = filter;
    }
    default() {
        if ( !this[ hasDefaultSymbol ] ) {
            throw new Error( `missing argument` );
        }
        return this[ defaultSymbol ];
    }
    replaceWith( value ) {
        if ( value instanceof Placeholder ) {
            if ( value[ hasDefaultSymbol ] ) {
                return this[ filterSymbol ]( value[ defaultSymbol ] );
            }
            return this;
        }
        return this[ filterSymbol ]( value );
    }
}

module.exports = Placeholder;
