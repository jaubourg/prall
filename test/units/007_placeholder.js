"use strict";

const { _ } = require( `../..` );

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
    "missing arguments": ( prall, concat ) => assert => {
        assert.expect( 1 );
        prall( concat, `a` ).with( _, `c` )()
            .catch( error => assert.strictEqual( error.message, `missing arguments` ) )
            .then( () => assert.done() );
    },
}, ( ...args ) => {
    let result = ``;
    for ( const string of args ) {
        result += string;
    }
    return result;
}, ( ...args ) => {
    const callback = args.pop();
    let result = ``;
    for ( const string of args ) {
        result += string;
    }
    callback( null, result );
} );
