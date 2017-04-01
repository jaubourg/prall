"use strict";

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
} );

const { adapt } = require( `../..` );

module.exports[ `cannot be adapted` ] = assert => {
    assert.expect( 1 );
    const instance = adapt( `` );
    assert.throws( () => adapt( instance ) );
    assert.done();
};
