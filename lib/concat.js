"use strict";

const placeholder = require( `./placeholder` );

module.exports = ( array1, array2, toFill ) => {
    if ( !toFill && ( !array2 || !array2.length ) ) {
        return array1;
    }
    let output;
    let index2 = 0;
    for ( let index1 = 0; index1 < array1.length; index1++ ) {
        let item = array1[ index1 ];
        if ( item === placeholder ) {
            if ( array2 && ( index2 < array2.length ) ) {
                if ( !output ) {
                    output = array1.slice( 0, index1 );
                }
                item = array2[ index2++ ];
            } else if ( toFill ) {
                throw new Error( `missing arguments` );
            }
        }
        if ( output ) {
            output.push( item );
        }
    }
    if ( !array2 || ( index2 >= array2.length ) ) {
        return output || array1;
    }
    if ( !output ) {
        output = array1.slice();
    }
    for ( ; index2 < array2.length; index2++ ) {
        const item = array2[ index2 ];
        if ( toFill && ( item === placeholder ) ) {
            throw new Error( `missing arguments` );
        }
        output.push( item );
    }
    return output;
};
