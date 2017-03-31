/* eslint-disable newline-per-chained-call, no-invalid-this */

"use strict";

const createContext = assert => {
    const context = {
        method() {
            assert.strictEqual( this, context );
        },
    };
    return context;
};

module.exports = require( `../both` )( {
    "use on": prall => assert => {
        assert.expect( 2 );
        const context = createContext( assert );
        prall( context.method ).on( context )();
        prall( `method` ).on( context )();
        assert.done();
    },
    "use bind": prall => assert => {
        assert.expect( 2 );
        const context = createContext( assert );
        prall( context.method ).bind( context )();
        prall( `method` ).bind( context )();
        assert.done();
    },
    "use call": prall => assert => {
        assert.expect( 2 );
        const context = createContext( assert );
        prall( context.method ).call( context );
        prall( `method` ).call( context );
        assert.done();
    },
    "use apply": prall => assert => {
        assert.expect( 2 );
        const context = createContext( assert );
        prall( context.method ).apply( context );
        prall( `method` ).apply( context );
        assert.done();
    },
    "on then on": prall => assert => {
        assert.expect( 2 );
        const context = createContext( assert );
        prall( context.method ).on( {} ).on( context )();
        prall( `method` ).on( {} ).on( context )();
        assert.done();
    },
    "on then bind": prall => assert => {
        assert.expect( 2 );
        const context = createContext( assert );
        prall( context.method ).on( {} ).bind( context )();
        prall( `method` ).on( {} ).bind( context )();
        assert.done();
    },
    "on then apply": prall => assert => {
        assert.expect( 2 );
        const context = createContext( assert );
        prall( context.method ).on( {} ).apply( context );
        prall( `method` ).on( {} ).apply( context );
        assert.done();
    },
    "on then call": prall => assert => {
        assert.expect( 2 );
        const context = createContext( assert );
        prall( context.method ).on( {} ).call( context );
        prall( `method` ).on( {} ).call( context );
        assert.done();
    },
    "bind then bind": prall => assert => {
        assert.expect( 2 );
        const context = createContext( assert );
        prall( context.method ).bind( context ).bind( {} )();
        prall( `method` ).bind( context ).bind( {} )();
        assert.done();
    },
    "bind then on": prall => assert => {
        assert.expect( 2 );
        const context = createContext( assert );
        prall( context.method ).bind( context ).on( {} )();
        prall( `method` ).bind( context ).on( {} )();
        assert.done();
    },
    "bind then apply": prall => assert => {
        assert.expect( 2 );
        const context = createContext( assert );
        prall( context.method ).bind( context ).apply( {} );
        prall( `method` ).bind( context ).apply( {} );
        assert.done();
    },
    "bind then call": prall => assert => {
        assert.expect( 2 );
        const context = createContext( assert );
        prall( context.method ).bind( context ).call( {} );
        prall( `method` ).bind( context ).call( {} );
        assert.done();
    },
} );
