"use strict";

class Context {
    constructor( context, locked ) {
        this.value = context;
        this.locked = locked;
    }
    set( context, locked ) {
        if ( this.locked || ( this.value === context ) ) {
            return this;
        }
        return new Context( context, locked );
    }
    get() {
        return this.value;
    }
}

module.exports = Context;
