"use strict";

module.exports = require( `../both` )( {
    "typeof": prall => assert => {
        assert.expect( 1 );
        assert.strictEqual( typeof prall( `` ), `function` );
        assert.done();
    },
    "instanceof": prall => assert => {
        assert.expect( 1 );
        assert.ok( prall( `` ) instanceof Function, `Function` );
        assert.done();
    },
    "toString": prall => assert => {
        assert.expect( 1 );
        assert.strictEqual( Object.prototype.toString.call( prall( `` ) ), `[object Function]` );
        assert.done();
    },
    "can be called": prall => assert => {
        assert.expect( 1 );
        prall( () => assert.ok( true ) )();
        assert.done();
    },
    "refuse non function": prall => assert => {
        assert.expect( 1 );
        assert.throws( () => prall( true ) );
        assert.done();
    },
    "prall cannot be adapted": prall => assert => {
        assert.expect( 1 );
        const instance = prall( `` );
        assert.throws( () => prall.adapt( instance ) );
        assert.done();
    },
    "prall of prall": ( prall, concat ) => assert => {
        assert.expect( 1 );
        prall.prall( prall( concat ).on( 10 ), 1, 2, 4 )
            .then( sum => assert.strictEqual( sum, 17 ), () => null )
            .then( () => assert.done() );
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
