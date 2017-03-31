"use strict";

const concat = require( `./concat` );

const dataMap = new WeakMap();

class ExtensibleFunction extends Function {
    constructor( func ) {
        return Object.setPrototypeOf( func, new.target.prototype );
    }
}

class Prall extends ExtensibleFunction {
    constructor( data ) {
        super( ( ...args ) => data.call( args ) );
        dataMap.set( this, data );
    }
    apply( context, args ) {
        const data = dataMap.get( this );
        return (
            data.contextLocked || ( data.context === context ) ?
                data :
                data.with( {
                    context,
                } )
        ).call( args );
    }
    bind( context ) {
        const data = dataMap.get( this );
        return data.contextLocked || ( data.context === context ) ? this : new Prall( data.with( {
            context,
            "contextLocked": true,
        } ) );
    }
    call( context, ...args ) {
        return this.apply( context, args );
    }
    catch( handler ) {
        return this().catch( handler );
    }
    filter( adapt ) {
        const data = dataMap.get( this );
        if ( !data.adapt ) {
            throw new Error( `cannot filter non-adapted prall functions` );
        }
        const type = typeof adapt;
        if ( type !== `function` ) {
            throw new Error( `function expected, ${ type } provided` );
        }
        return data.adpat === adapt ? this : new Prall( data.with( {
            adapt,
        } ) );
    }
    on( context ) {
        const data = dataMap.get( this );
        return data.contextLocked || ( data.context === context ) ? this : new Prall( data.with( {
            context,
        } ) );
    }
    then( resolveHandler, rejectHandler ) {
        return this().then( resolveHandler, rejectHandler );
    }
    with( ...args ) {
        if ( !args.length ) {
            return this;
        }
        const data = dataMap.get( this );
        return new Prall( data.with( {
            "args": concat( data.args, args ),
        } ) );
    }
}

module.exports = Prall;
