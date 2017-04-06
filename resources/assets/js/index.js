/**
 * Created by claudio on 5.4.17.
 */


$( function ( ) {

    var reader = new InputReader('', '', false, 2);
    reader.enableKeyDownTimer();
    reader.initKeyPress();

    // $('#reader').keyboard({type:'tel'});
} );