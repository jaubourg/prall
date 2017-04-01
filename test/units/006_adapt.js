"use strict";

const prall = require( `../..` );

module.exports = {
    "must be adapted to accept filter": assert => {
        assert.expect( 1 );
        prall.adapt( `` ).filter( () => null );
        assert.throws( () => prall( `` ).filter( () => null ) );
        assert.done();
    },
    "filter must be a function": assert => {
        assert.expect( 7 );
        const instance = prall.adapt( `` );
        assert.throws( () => instance.filter() );
        assert.throws( () => instance.filter( `a string` ) );
        assert.throws( () => instance.filter( null ) );
        assert.throws( () => instance.filter( true ) );
        assert.throws( () => instance.filter( {} ) );
        assert.throws( () => instance.filter( [] ) );
        assert.throws( () => instance.filter( 0 ) );
        assert.done();
    },
    "default behaviour without filter": assert => {
        assert.expect( 2 );
        Promise.all( [
            prall.adapt( callback => callback( true ) )
                .catch( flag => assert.ok( flag ) ),
            prall.adapt( callback => callback( null, true ) )
                .then( flag => assert.ok( flag ), () => null ),
        ] ).then( () => assert.done() );
    },
    "filter": assert => {
        assert.expect( 4 );
        const instance = prall.adapt( ( object, callback ) => callback( object ) );
        const filtered = instance.filter( ( { fail, pass } ) => [ fail, pass ] );
        const error = {
            "fail": true,
        };
        const success = {
            "pass": true,
        };
        Promise.all( [
            instance( error ).catch( flag => assert.ok( flag ) ),
            instance( success ).catch( flag => assert.ok( flag ) ),
            filtered( error ).catch( flag => assert.ok( flag ) ),
            filtered( success ).then( flag => assert.ok( flag ), () => null ),
        ] ).then( () => assert.done() );
    },
    "same filter = same instance": assert => {
        assert.expect( 1 );
        const filter = () => null;
        const instance = prall.adapt( `` ).filter( filter );
        assert.strictEqual( instance.filter( filter ), instance );
        assert.done();
    },
    "filter that throws": assert => {
        assert.expect( 1 );
        const error = {};
        const filter = () => {
            throw error;
        };
        prall.adapt( callback => callback() ).filter( filter )
            .catch( e => assert.strictEqual( e, error ) )
            .then( () => assert.done() );
    },
};
