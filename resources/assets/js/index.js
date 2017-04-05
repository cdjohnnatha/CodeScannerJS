/**
 * Created by claudio on 5.4.17.
 */


$( function ( ) {

    var reader = new InputReader($(this), $(this).find('#reader'), '', '', false, 2);
    console.log(reader.setMaxNumbersAllowed(20));
    console.log(reader.isAllowedCharacters());
    reader.setAllowedCharacters(true);
    console.log('test');
    reader.initKeyPress();
} );