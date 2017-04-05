/**
 * Created by claudio on 5.4.17.
 */


$( function ( ) {

    var reader = new InputReader($(this), $(this).find('#reader'), '', '', false, 2);
    reader.enableKeyDownTimer();
    reader.initKeyPress();
} );