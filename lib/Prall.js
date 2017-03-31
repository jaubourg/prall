"use strict";

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
        return dataMap.get( this )
            .withContext( context )
            .call( args );
    }
    bind( context ) {
        const data = dataMap.get( this );
        const newData = data.withContext( context, true );
        return data === newData ? this : new Prall( newData );
    }
    call( context, ...args ) {
        return this.apply( context, args );
    }
    catch( handler ) {
        return this().catch( handler );
    }
    filter( adapt ) {
        const data = dataMap.get( this );
        const newData = data.withAdapt( adapt );
        return data === newData ? this : new Prall( newData );
    }
    on( context ) {
        const data = dataMap.get( this );
        const newData = data.withContext( context );
        return data === newData ? this : new Prall( newData );
    }
    then( resolveHandler, rejectHandler ) {
        return this().then( resolveHandler, rejectHandler );
    }
    with( ...args ) {
        const data = dataMap.get( this );
        const newData = data.withArgs( args );
        return data === newData ? this : new Prall( newData );
    }
}

module.exports = Prall;
