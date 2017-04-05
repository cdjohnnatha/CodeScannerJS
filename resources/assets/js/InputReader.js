/**
 * Created by claudio on 5.4.17.
 */


/**
 * Class representing readers input
 */

/**
 * KEYCODE used as constant at InputReader class
 * @type {number}
 */
const ENTER = 13;
const BACKSPACE = 8;
const CHARACTERS_BEGIN = 48;
const CHARACTERS_END = 57;
const KEYPAD_BEGIN = 96;
const KEYPAD_END = 105;
const GENERIC_KEYBOARD_EVENT = 0;
const LEFT_ARROW = 37;
const RIGHT_ARROW = 39;

/**
 * @param {Object} inputField field which will be filled with the reader values.
 * @param {string} serverUrl address which will be send the data of reader
 * @param {string} redirectUrl url which the website will be redirected after read the input
 * @param {bool} allowRedirect set if page will be redirected after read the inputs.
 * @param {bool} insertionDefaultNumbers some readers have a default completion. If the cards contains 8 digits, the machine
 * will always put 10 for example.
 * @param {Object} DOM dom of page.
 *
 */

var InputReader = function InputReader(DOM, inputField, serverUrl, redirectUrl, allowRedirect, insertionDefaultNumbers) {

    var _input = inputField;
    var _minNumbersAllowed = 8;
    var _maxNumbersAllowed = 10;
    var _clickFocuses = true;
    var _obj = {};
    var _typingTime = 0;
    var _allowedCharacters = false;
    var _warningMessage = 'User not Found!';
    var _successMessage = 'Success';
    var _redirectTime = 1000;
    var _serverUrl = serverUrl;
    var _redirectUrl = redirectUrl;
    var _allowRedirect = allowRedirect;
    var _insertionDefaultNumbers = insertionDefaultNumbers;
    var _clickFocuses = true;
    var _intervalTypingTime = 1000;
    var _typingTime = 0;
    var _clock = new Date();

    /**
     * Object containing the input field
     * @returns {Object}
     */
    this.getInputKey = function () { return _input; };
    this.setInputKey = ( function(inputField ) { _input = inputField; } );
    this.getMaxNumbersAllowed = function( ) { return _maxNumbersAllowed; };
    this.setMaxNumbersAllowed = ( function( maxAllowed ) { _maxNumbersAllowed = maxAllowed; } );
    this.getMinNumbersAllowed = ( function( ) { return _minNumbersAllowed; });
    this.setMinNumbersAllowed = ( function ( minAllowed ) { _minNumbersAllowed = minAllowed; } );

    this.isFocused = ( function ( ) { return _focuses; } );
    this.setFocuses = ( function ( inputFocus ) { _focuses = inputFocus; } );
    this.isClickFocusing = ( function( ) { return _clickFocuses; } );

    this.setClickFocusing = ( function ( clickFocusing ){
        _clickFocuses = clickFocusing;
        if(_clickFocuses == true){
            $(this).click(function(){
                _input.focus();
            });
        }else{
            $(this).off('click');
        }
    });
    this.getTypingTime = ( function ( ) { return _typingTime; } );
    this.setTypingTime = ( function ( typingTime ) { _typingTime = typingTime; } );
    this.getIntervalTypingTime = ( function ( ) { return _intervalTypingTime; } );
    this.setIntervalTypingTime = ( function ( typingInterval ) { _intervalTypingTime = typingInterval; } );
    this.isAllowedCharacters = ( function ( ) { return _allowedCharacters; } );
    this.setAllowedCharacters = ( function ( allow ) { _allowedCharacters = allow; } );
    this.getWarningMessage = ( function ( ) { return _warningMessage; } );
    this.setWarningMessage = ( function ( msg ) { _warningMessage = msg; } );
    this.getSuccessMessage = ( function ( ) { return _successMessage; } );
    this.setSuccessMessage = ( function ( msg ) { _successMessage = msg; } );
    this.getRedirectTime = ( function ( ) { return _redirectTime; } );
    this.setRedirectTime = ( function ( time ) { _redirectTime = time; } );
    this.getServerUrl = ( function ( ) { return _serverUrl; } );
    this.setServerUrl = ( function ( url ) { _serverUrl = url; } );
    this.getRedirectUrl = ( function ( ) { return _redirectUrl; } );
    this.setRedirectUrl = ( function ( url ) { _redirectUrl = url; } );
    this.isAllowRedirect = ( function ( ) { return _allowRedirect; } );
    this.setAllowRedirect = ( function ( permission ) { _allowRedirect = permission; } );
    this.isInsertedNumbers = ( function ( ) { return _insertionDefaultNumbers; } );
    this.insertionDefaultNumbers = ( function ( insertion ) { _insertionDefaultNumbers = completion; } );
    /**
     * Send post will send the data filled from some reader at input.
     *
     * @param { Object } obj contaning the fields which will be send.
     */
    this.sendPost = ( function ( obj ) {
        $.post( _serverUrl, { data: obj } )
            .done( function( msg ) {
                if( msg == 'false' ){
                    showMessage( this._warningMessage, 'warning' );
                    _input.val( '' );

                } else {
                    showMessage( this._successMessage, 'success' );
                    redirectUrlTime( this._redirectUrl, this._redirectTime );

                }
            })
            .fail( function( xhr, status, error ) {
                showMessage( 'Some error happend while trying save! Try again.', 'error' );
                console.log( error + ' - status: ' + status );
            });
    } );

    this.initKeyPress = ( function ( ) {
        DOM.on ( 'keypress', function ( e ) {
            console.log(_input);
            var keycode = e.keycode || e.which;
            var typedValue = _input.val();
            if ( keycode == ENTER && (typedValue.length >= this.minNumbersAllowed && typedValue.length <=
                _maxNumbersAllowed ) ) {
                if( _insertionDefaultNumbers ) {
                    if ( typedValue.length == _maxNumbersAllowed ) {
                        typedValue = typedValue.substr( 1, typedValue.length );
                    }
                }
                var obj = new Object();
                obj.credentials = typedValue;
                this.sendPost( obj );
            }

            //Blocking letters
            if( ! _allowedCharacters ) {
                if ( keycode != BACKSPACE && keycode != GENERIC_KEYBOARD_EVENT &&
                    keycode < CHARACTERS_BEGIN || keycode > CHARACTERS_END ) {
                    return false;
                }
            }

            if( typedValue.length >= (_minNumbersAllowed -1 ) && typedValue.length <= ( _maxNumbersAllowed -1 )
                && (( keycode >= CHARACTERS_BEGIN && keycode <= CHARACTERS_END && keycode >= KEYPAD_BEGIN && keycode <= KEYPAD_END )
                || ( keycode == RIGHT_ARROW || keycode == LEFT_ARROW || keycode == ENTER ))){
                if ( typedValue.length - 1 <= 0 ) {
                    // firstTime = clock.getTime();
                }
                _startCheckTypingSpeed;
            }
            if( typedValue.length >= _maxNumbersAllowed && keycode != BACKSPACE && keycode != GENERIC_KEYBOARD_EVENT ){
                return false;
            }
        });
    } );


    /**
     * Enable event handler keydown to this._input field which will verify when the user stopped to type;
     */
    this.enableKeyDownTimer = ( function ( ) {
        this._input.on( 'keydown', function ( ) {
            clearTimeout( _typingTimer);
            if ( _input.val().length == 0 ) {
                _clock = new Date();
            }
        });
    } );

    // Function will verify in intervals if the user stopped to typing and check the interval time between stop and hit up;
    this.startCheckTypingSpeed = ( function ( ) {
        // clear the time typing if called some event handler keyup;
        clearTimeout ( _typingTimer );
        _typingTimer = setTimeout( this.doneTyping, _intervalTypingTime );
    } );


    //function
    this.doneTyping = ( function ( ) {
        if( _input.val().length == _maxNumbersAllowed ) {

        }
        // clock = new Date();
        var finaldate = clock.getTime();
        // console.log("time");
        // console.log(finaldate - firstTime);
    } );

}