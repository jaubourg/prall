"use strict";

module.exports = require( `../both` )( {
    "on creation": ( prall, sum ) => assert => {
        assert.expect( 1 );
        prall( sum, 1, 2, 4 )
            .then(
                result => assert.strictEqual( result, 7 ),
                error => assert.doesNotThrow( () => {
                    throw error;
                } )
            )
            .then( () => assert.done() );
    },
    "on call": ( prall, sum ) => assert => {
        assert.expect( 1 );
        prall( sum )( 1, 2, 4 )
            .then(
                result => assert.strictEqual( result, 7 ),
                error => assert.doesNotThrow( () => {
                    throw error;
                } )
            )
            .then( () => assert.done() );
    },
    "using with": ( prall, sum ) => assert => {
        assert.expect( 1 );
        prall( sum ).with( 1, 2, 4 )
            .then(
                result => assert.strictEqual( result, 7 ),
                error => assert.doesNotThrow( () => {
                    throw error;
                } )
            )
            .then( () => assert.done() );
    },
    ".apply": ( prall, sum ) => assert => {
        assert.expect( 1 );
        // eslint-disable-next-line no-useless-call
        prall( sum ).apply( null, [ 1, 2, 4 ] )
            .then(
                result => assert.strictEqual( result, 7 ),
                error => assert.doesNotThrow( () => {
                    throw error;
                } )
            )
            .then( () => assert.done() );
    },
    ".call": ( prall, sum ) => assert => {
        assert.expect( 1 );
        // eslint-disable-next-line no-useless-call
        prall( sum ).call( null, 1, 2, 4 )
            .then(
                result => assert.strictEqual( result, 7 ),
                error => assert.doesNotThrow( () => {
                    throw error;
                } )
            )
            .then( () => assert.done() );
    },
    "mixed": ( prall, sum ) => assert => {
        assert.expect( 1 );
        prall( sum, 1 ).with( 2 )( 4 )
            .then(
                result => assert.strictEqual( result, 7 ),
                error => assert.doesNotThrow( () => {
                    throw error;
                } )
            )
            .then( () => assert.done() );
    },
    "mixed with empty apply": ( prall, sum ) => assert => {
        assert.expect( 1 );
        prall( sum, 1 ).with( 2, 4 )
            .apply()
            .then(
                result => assert.strictEqual( result, 7 ),
                error => assert.doesNotThrow( () => {
                    throw error;
                } )
            )
            .then( () => assert.done() );
    },
    "no new args = same instance": prall => assert => {
        assert.expect( 1 );
        const instance = prall( `` );
        assert.strictEqual( instance.with(), instance );
        assert.done();
    },
},
( ...args ) => args.reduce( ( sum, number ) => sum + number ),
( ...args ) => {
    const callback = args.pop();
    callback( null, args.reduce( ( sum, number ) => sum + number ) );
} );
