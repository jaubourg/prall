"use strict";

const hasDefaultSymbol = Symbol( `hasDefault` );
const defaultSymbol = Symbol( `default` );

class Placeholder {
    constructor( value ) {
        this[ hasDefaultSymbol ] = arguments.length;
        this[ defaultSymbol ] = value;
    }
    default() {
        if ( !this[ hasDefaultSymbol ] ) {
            throw new Error( `missing argument` );
        }
        return this[ defaultSymbol ];
    }
    replaceWith( value ) {
        if ( value instanceof Placeholder ) {
            return value[ hasDefaultSymbol ] ? value : this;
        }
        return value;
    }
}

module.exports = Placeholder;
