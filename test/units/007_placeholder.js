"use strict";

const { _, Placeholder } = require( `../..` );

module.exports = require( `../both` )( {
    "1st of 3": ( prall, concat ) => assert => {
        assert.expect( 1 );
        prall( concat, _, `b`, `c` )( `a` )
            .then(
                string => assert.strictEqual( string, `abc` ),
                () => null
            )
            .then( () => assert.done() );
    },
    "2nd of 3": ( prall, concat ) => assert => {
        assert.expect( 1 );
        prall( concat, `a`, _, `c` )( `b` )
            .then(
                string => assert.strictEqual( string, `abc` ),
                () => null
            )
            .then( () => assert.done() );
    },
    "3rd of 3": ( prall, concat ) => assert => {
        assert.expect( 1 );
        prall( concat, `a`, `b`, _ )( `c` )
            .then(
                string => assert.strictEqual( string, `abc` ),
                () => null
            )
            .then( () => assert.done() );
    },
    "1st & 2nd of 3": ( prall, concat ) => assert => {
        assert.expect( 1 );
        prall( concat, _, _, `c` )( `a`, `b` )
            .then(
                string => assert.strictEqual( string, `abc` ),
                () => null
            )
            .then( () => assert.done() );
    },
    "1st & 3rd of 3": ( prall, concat ) => assert => {
        assert.expect( 1 );
        prall( concat, _, `b`, _ )( `a`, `c` )
            .then(
                string => assert.strictEqual( string, `abc` ),
                () => null
            )
            .then( () => assert.done() );
    },
    "2nd & 3rd of 3": ( prall, concat ) => assert => {
        assert.expect( 1 );
        prall( concat, `a`, _, _ )( `b`, `c` )
            .then(
                string => assert.strictEqual( string, `abc` ),
                () => null
            )
            .then( () => assert.done() );
    },
    "2nd of 3 using with": ( prall, concat ) => assert => {
        assert.expect( 1 );
        prall( concat, `a` ).with( _, `c` )( `b` )
            .then(
                string => assert.strictEqual( string, `abc` ),
                () => null
            )
            .then( () => assert.done() );
    },
    "missing argument": ( prall, concat ) => assert => {
        assert.expect( 1 );
        prall( concat, `a` ).with( _, `c` )()
            .catch( error => assert.strictEqual( error.message, `missing argument` ) )
            .then( () => assert.done() );
    },
    "adding placeholders in placeholders": ( prall, concat ) => assert => {
        assert.expect( 1 );
        prall( concat, _, _, _ )
            .with( _, `b` )
            .with( `a`, `c`, _, `e` )( `d` )
            .then(
                string => assert.strictEqual( string, `abcde` ),
                () => null
            )
            .then( () => assert.done() );
    },
    "placeholder with default": ( prall, concat ) => assert => {
        assert.expect( 1 );
        prall( concat, new Placeholder( `a` ), `b` )
            .then(
                string => assert.strictEqual( string, `ab` ),
                () => null
            )
            .then( () => assert.done() );
    },
    "placeholder replace with default": ( prall, concat ) => assert => {
        assert.expect( 1 );
        prall( concat, _, `b` ).with( new Placeholder( `a` ) )
            .then(
                string => assert.strictEqual( string, `ab` ),
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
