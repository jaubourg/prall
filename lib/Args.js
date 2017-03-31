"use strict";

const placeHolder = {};

class Args {
    constructor( args, from = 0 ) {
        if ( args ) {
            this.args = args;
            this.placeHolders = [];
            for ( let i = 0; i < args.length; i++ ) {
                if ( args[ i ] === placeHolder ) {
                    this.placeHolders.push( i + from );
                }
            }
        }
    }
    toArray() {
        if ( this.placeHolders.length ) {
            throw new Error( `missing arguments` );
        }
        return this.args;
    }
    with( args ) {
        // no args to add
        if ( !args || !args.length ) {
            return this;
        }
        // no existing args
        if ( !this.args.length ) {
            return new Args( args );
        }
        // no placeholders
        if ( !this.placeHolders.length ) {
            // find placeholders in new args and concat everything
            const tmp = new Args( args, this.args.length );
            tmp.args = this.args.concat( args );
            return tmp;
        }
        // now to the difficult job
        const targetArgs = this.args.slice();
        const targetPlaceHolders = [];
        const { placeHolders } = this;
        let index = 0;
        // try & fill as many placeholders as possible
        for ( ; ( index < placeHolders.length ) && ( index < args.length ); index++ ) {
            const item = args[ index ];
            const targetIndex = placeHolders[ index ];
            if ( item === placeHolder ) {
                targetPlaceHolders.push( targetIndex );
            } else {
                targetArgs[ targetIndex ] = item;
            }
        }
        // keep track of the placeholders who couldn't be filled
        for ( let i = index; i < placeHolders.length; i++ ) {
            targetPlaceHolders.push( placeHolders[ i ] );
        }
        // push the remaining args
        for ( ; index < args.length; index++ ) {
            const item = args[ index ];
            if ( item === placeHolder ) {
                targetPlaceHolders.push( targetArgs.length );
            }
            targetArgs.push( item );
        }
        // build the corresponding instance and return
        const newInstance = new Args();
        newInstance.args = targetArgs;
        newInstance.placeHolders = targetPlaceHolders;
        return newInstance;
    }
}

Args.placeHolder = placeHolder;

module.exports = Args;
