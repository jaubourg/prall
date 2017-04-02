"use strict";

module.exports = require( `../both` )( {
    "bind, on & with return a new instance": prall => assert => {
        assert.expect( 3 );
        const instance = prall( `` );
        assert.notStrictEqual( instance.bind( {} ), instance, `bind` );
        assert.notStrictEqual( instance.on( {} ), instance, `on` );
        assert.notStrictEqual( instance.with( true ), instance, `with` );
        assert.done();
    },
    "chaining": ( prall, sum ) => assert => {
        assert.expect( 6 );
        const base = prall( sum ).on( 0 );
        const plus10 = base.with( 10 );
        const on3 = plus10.bind( 3 );
        const base64 = base.with( 14, 20, 30 );
        const base32 = base64.on( -32 );
        const eleven = prall.prall( base32, -21 );
        Promise.all( [
            base.then( result => assert.strictEqual( result, 0 ) ),
            plus10.then( result => assert.strictEqual( result, 10 ) ),
            on3.then( result => assert.strictEqual( result, 13 ) ),
            base64.then( result => assert.strictEqual( result, 64 ) ),
            base32.then( result => assert.strictEqual( result, 32 ) ),
            eleven.then( result => assert.strictEqual( result, 11 ) ),
        ] ).then( () => assert.done(), () => assert.done() );
    },
}, function( ...args ) {
    // eslint-disable-next-line
    let result = this;
    for ( const number of args ) {
        result += number;
    }
    return result;
}, function( ...args ) {
    const callback = args.pop();
    // eslint-disable-next-line
    let result = this;
    for ( const number of args ) {
        result += number;
    }
    callback( null, result );
} );

const globalPrall = require( `../..` );

module.exports[ `filter returns a new instance` ] = assert => {
    assert.expect( 1 );
    const instance = globalPrall.adapt( `` );
    assert.notStrictEqual( instance.filter( () => null ), instance );
    assert.done();
};
