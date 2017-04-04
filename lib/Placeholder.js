"use strict";

const hasDefaultSymbol = Symbol( `hasDefault` );
const defaultSymbol = Symbol( `default` );

class Placeholder {
    constructor( value ) {
        if ( ( this[ hasDefaultSymbol ] = Boolean( arguments.length ) ) ) {
            this.check( value );
            this[ defaultSymbol ] = value;
        }
    }
    // eslint-disable-next-line class-methods-use-this, no-unused-vars
    check( value ) {
        // subclasses may throw
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
                this.check( value[ defaultSymbol ] );
                return value;
            }
            return this;
        }
        this.check( value );
        return value;
    }
}

module.exports = Placeholder;
