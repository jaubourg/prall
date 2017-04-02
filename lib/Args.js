"use strict";

const placeholder = Symbol( `placeholder` );

class Args {
    constructor( args, from = 0 ) {
        if ( args ) {
            this.args = args;
            this.placeholders = [];
            for ( let i = 0; i < args.length; i++ ) {
                if ( args[ i ] === placeholder ) {
                    this.placeholders.push( i + from );
                }
            }
        }
    }
    add( args ) {
        // no args to add
        if ( !args || !args.length ) {
            return this;
        }
        // no existing args
        if ( !this.args.length ) {
            return new Args( args );
        }
        const { placeholders } = this;
        // no placeholders
        if ( !placeholders.length ) {
            // find placeholders in new args and concat everything
            const tmp = new Args( args, this.args.length );
            tmp.args = this.args.concat( args );
            return tmp;
        }
        // now to the difficult job
        const targetArgs = this.args.slice();
        const targetPlaceholders = [];
        let index = 0;
        // try & fill as many placeholders as possible
        for ( ; ( index < placeholders.length ) && ( index < args.length ); index++ ) {
            const item = args[ index ];
            const targetIndex = placeholders[ index ];
            if ( item === placeholder ) {
                targetPlaceholders.push( targetIndex );
            } else {
                targetArgs[ targetIndex ] = item;
            }
        }
        // keep track of the placeholders who couldn't be filled
        for ( let i = index; i < placeholders.length; i++ ) {
            targetPlaceholders.push( placeholders[ i ] );
        }
        // push the remaining args
        for ( ; index < args.length; index++ ) {
            const item = args[ index ];
            if ( item === placeholder ) {
                targetPlaceholders.push( targetArgs.length );
            }
            targetArgs.push( item );
        }
        // build the corresponding instance and return
        const newInstance = new Args();
        newInstance.args = targetArgs;
        newInstance.placeholders = targetPlaceholders;
        return newInstance;
    }
    toArray() {
        if ( this.placeholders.length ) {
            throw new Error( `missing arguments` );
        }
        return this.args;
    }
}

Args.placeholder = placeholder;

module.exports = Args;
