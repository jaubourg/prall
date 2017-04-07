"use strict";

const { _ } = require( `../..` );

module.exports = require( `../both` )( {
    "errors": prall => assert => {
        assert.expect( 2 );
        assert.throws( () => prall( `` ).cap( true ) );
        assert.throws( () => prall( `` ).cap( -2 ) );
        assert.done();
    },
    "cap of cap": prall => assert => {
        assert.expect( 1 );
        const capped =
            prall( `` )
                .cap( 2 )
                .with( `a` );
        assert.strictEqual( capped, capped.cap( 1 ) );
        assert.done();
    },
    "standard": ( prall, concat ) => assert => {
        assert.expect( 1 );
        prall( concat, `a`, `b` )
            .cap()
            .with( `c`, `d` )
            .then(
                result => assert.strictEqual( result, `ab` ),
                () => null
            )
            .then( () => assert.done() );
    },
    "standard (call)": ( prall, concat ) => assert => {
        assert.expect( 1 );
        prall( concat, `a`, `b` )
            .cap()( `c`, `d` )
            .then(
                result => assert.strictEqual( result, `ab` ),
                () => null
            )
            .then( () => assert.done() );
    },
    "positive number": ( prall, concat ) => assert => {
        assert.expect( 1 );
        prall( concat, `a`, `b` )
            .cap( 1 )
            .with( `c`, `d` )
            .then(
                result => assert.strictEqual( result, `abc` ),
                () => null
            )
            .then( () => assert.done() );
    },
    "positive number (call)": ( prall, concat ) => assert => {
        assert.expect( 1 );
        prall( concat, `a`, `b` )
            .cap( 1 )( `c`, `d` )
            .then(
                result => assert.strictEqual( result, `abc` ),
                () => null
            )
            .then( () => assert.done() );
    },
    "standard with placeholder": ( prall, concat ) => assert => {
        assert.expect( 1 );
        prall( concat, `a`, _, `c` )
            .cap()
            .with( `b`, `d` )
            .then(
                result => assert.strictEqual( result, `abc` ),
                () => null
            )
            .then( () => assert.done() );
    },
    "standard with placeholder (call)": ( prall, concat ) => assert => {
        assert.expect( 1 );
        prall( concat, `a`, _, `c` )
            .cap()( `b`, `d` )
            .then(
                result => assert.strictEqual( result, `abc` ),
                () => null
            )
            .then( () => assert.done() );
    },
    "positive number with placeholder": ( prall, concat ) => assert => {
        assert.expect( 1 );
        prall( concat, `a`, _, `c` )
            .cap( 1 )
            .with( `b`, `d`, `e` )
            .then(
                result => assert.strictEqual( result, `abcd` ),
                () => null
            )
            .then( () => assert.done() );
    },
    "positive number with placeholder (call)": ( prall, concat ) => assert => {
        assert.expect( 1 );
        prall( concat, `a`, _, `c` )
            .cap( 1 )( `b`, `d`, `e` )
            .then(
                result => assert.strictEqual( result, `abcd` ),
                () => null
            )
            .then( () => assert.done() );
    },
    "too many placeholders": ( prall, concat ) => assert => {
        assert.expect( 1 );
        prall( concat, `a`, _, `c` )
            .cap()
            .with( `b`, _ )
            .then(
                result => assert.strictEqual( result, `abc` ),
                () => null
            )
            .then( () => assert.done() );
    },
},
( ...args ) => args.join( `` ),
( ...args ) => {
    const callback = args.pop();
    callback( null, args.join( `` ) );
} );
