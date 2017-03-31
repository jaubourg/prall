"use strict";

module.exports = require( `../both` )( {
    "is thenable": prall => assert => {
        assert.expect( 2 );
        assert.strictEqual( typeof prall( `` ).then, `function` );
        assert.strictEqual( typeof prall( `` ).catch, `function` );
        assert.done();
    },
    "returns a promise": prall => assert => {
        assert.expect( 1 );
        assert.ok( prall( () => null )() instanceof Promise );
        assert.done();
    },
    "is called on then": prall => assert => {
        assert.expect( 2 );
        const instance = prall( () => assert.ok( true ) );
        instance.then();
        instance.then();
        assert.done();
    },
    "is called on catch": prall => assert => {
        assert.expect( 2 );
        const instance = prall( () => assert.ok( true ) );
        instance.catch();
        instance.catch();
        assert.done();
    },
    "resolve on return": ( prall, func ) => assert => {
        assert.expect( 1 );
        prall( func )
            .then( () => assert.ok( true ), () => null )
            .then( () => assert.done() );
    },
    "reject on throw": prall => assert => {
        assert.expect( 1 );
        prall( () => {
            throw new Error();
        } )
            .catch( () => assert.ok( true ) )
            .then( () => assert.done() );
    },
}, () => null, callback => callback() );

const globalPrall = require( `../..` );

module.exports[ `same state as returned promise` ] = assert => {
    assert.expect( 2 );
    Promise.all( [
        globalPrall( () => Promise.resolve( true ) ).then(
            state => assert.ok( state ),
            () => null
        ),
        globalPrall( () => Promise.reject( new Error() ) ).then(
            () => null,
            error => assert.ok( Boolean( error ) )
        ),
    ] )
        .catch( () => null )
        .then( () => assert.done() );
};
