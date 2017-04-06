"use strict";

class Context {
    constructor( value, locked ) {
        this.value = value;
        this.locked = locked;
    }
    set( value, locked ) {
        if ( this.locked || ( this.value === value ) ) {
            return this;
        }
        return new Context( value, locked );
    }
    get() {
        return this.value;
    }
}

module.exports = () => new Context();
