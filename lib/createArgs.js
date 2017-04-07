"use strict";

const Placeholder = require( `./Placeholder` );

// eslint-disable-next-line prefer-const
let newInstance;

class Args {
    constructor( args, placeholders, max ) {
        this.args = args;
        this.max = max;
        this.placeholders = placeholders;
    }
    cap( number ) {
        const { args } = this;
        const max = args.length + number;
        return max === this.max ? this : new Args( args, this.placeholders, max );
    }
    concat( args ) {
        // no args to add
        if ( !args || !args.length ) {
            return this;
        }
        // no existing args
        if ( !this.args.length ) {
            return newInstance( args, null, this.max );
        }
        const { placeholders } = this;
        // no placeholders
        if ( !placeholders.length ) {
            // find placeholders in new args and concat everything
            return newInstance( args, this.args, this.max );
        }
        // now to the difficult job
        const targetArgs = this.args.slice();
        const targetPlaceholders = [];
        let index = 0;
        // try & fill as many placeholders as possible
        for ( ; ( index < placeholders.length ) && ( index < args.length ); index++ ) {
            const targetIndex = placeholders[ index ];
            const replaced = targetArgs[ targetIndex ].replaceWith( args[ index ] );
            if ( replaced instanceof Placeholder ) {
                targetPlaceholders.push( targetIndex );
            }
            targetArgs[ targetIndex ] = replaced;
        }
        // keep track of the placeholders who couldn't be filled
        for ( let i = index; i < placeholders.length; i++ ) {
            targetPlaceholders.push( placeholders[ i ] );
        }
        // push the remaining args
        for ( ; index < args.length; index++ ) {
            const item = args[ index ];
            if ( item instanceof Placeholder ) {
                targetPlaceholders.push( targetArgs.length );
            }
            targetArgs.push( item );
        }
        // build the corresponding instance and return
        return new Args( targetArgs, targetPlaceholders, this.max );
    }
    toArray() {
        const { max, placeholders } = this;
        const args = ( placeholders.length || ( max != null ) ) ? this.args.slice( 0, max ) : this.args;
        for ( const index of placeholders ) {
            if ( index >= max ) {
                break;
            }
            args[ index ] = args[ index ].default();
        }
        return args;
    }
}

newInstance = ( args, previousArgs, max ) => {
    const from = previousArgs ? previousArgs.length : 0;
    const placeholders = [];
    for ( let i = 0; i < args.length; i++ ) {
        if ( args[ i ] instanceof Placeholder ) {
            placeholders.push( i + from );
        }
    }
    return new Args( from ? previousArgs.concat( args ) : args, placeholders, max );
};

module.exports = newInstance;
