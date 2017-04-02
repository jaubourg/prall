"use strict";

const globalPrall = require( `../..` );
const { adapt } = globalPrall;

module.exports = require( `../both` )( {
    "typeof": prall => assert => {
        assert.expect( 1 );
        assert.strictEqual( typeof prall( `` ), `function` );
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
        assert.throws( () => adapt( instance ) );
        assert.done();
    },
} );

module.exports[ `prall of prall` ] = assert => {
    assert.expect( 1 );
    globalPrall(
        globalPrall( function( a, b, c ) {
            // eslint-disable-next-line no-invalid-this
            return this + a + b + c;
        } ).on( 10 ),
        1, 2, 4
    )
        .then( sum => assert.strictEqual( sum, 17 ), () => null )
        .then( () => assert.done() );
};
