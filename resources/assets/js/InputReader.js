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

var InputReader = function InputReader(serverUrl, redirectUrl, allowRedirect, insertionDefaultNumbers) {

    var DOM = $(document);
    var _input = $('.InputReader');
    var _minNumbersAllowed = 8;
    var _maxNumbersAllowed = 10;
    var _focuses = false;
    var _obj = {};
    var _allowedCharacters = false;
    var _warningMessage = 'User not Found!';
    var _successMessage = 'Success';
    var _redirectTime = 1000;
    var _serverUrl = serverUrl;
    var _redirectUrl = redirectUrl;
    var _allowRedirect = allowRedirect;
    var _insertionDefaultNumbers = insertionDefaultNumbers;
    var _clickFocuses = false;
    var _typingTime = 0;
    var _firstTime = 0;
    var _clock = new Date();
    var _timing_to_input = 800;
    var _warning_message_timer = 800;
    var _allow_input_time = true;

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
    this.setFocuses = ( function ( inputFocus ) {
        _focuses = inputFocus;
        if(_focuses){
            _input.focus();
        }else{
            _input.off('focus');
        }
    } );
    this.isClickFocusing = ( function( ) { return _clickFocuses; } );

    this.setClickFocusing = ( function ( clickFocusing ){
        _clickFocuses = clickFocusing;
        if(_clickFocuses){
            DOM.click(function(){
                _input.focus();
            });
        }else{
            DOM.off('click');
        }
    });

    this.getTypingTime = ( function ( ) { return _typingTime; } );
    this.setTypingTime = ( function ( typingTime ) { _typingTime = typingTime; } );
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
    this.blockScreenFocus = ( function ( ) { this.setFocuses(true); this.setClickFocusing(true); } );
    this.inputTimeBlocker = ( function ( ) { return _timing_to_input; })
    this.setInputTimeBlocker = ( function ( time ) { _timing_to_input = time; });
    this.getWarningMessageTimer = ( function ( ) { return _warning_message_timer; } );
    this.setWarningMessageTimer = ( function ( time ) { _warning_message_timer = time; } );
    this.isAllowedInputTime = ( function () { return _allow_input_time; } );
    this.setAllowedInputTime = ( function ( option ) { _allow_input_time = option; } );

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
            console.log(_input.hasClass('InputReader-codebar'));
            if(_input.hasClass('InputReader-codebar') == true){
                _allowedCharacters = true;
                _maxNumbersAllowed = 100;
                _minNumbersAllowed = 3;
                _allow_input_time = false;
                console.log('test');
            }
            DOM.on ( 'keypress', function ( e ) {
                var keycode = e.keycode || e.which;
                var typedValue = _input.val();

                if(_input.val().length == 0 && _allow_input_time){
                    _clock = new Date();
                }

                if ( keycode == ENTER && (typedValue.length >= _minNumbersAllowed && typedValue.length <=
                    _maxNumbersAllowed )) {
                    if( _insertionDefaultNumbers ) {
                        if ( typedValue.length == _maxNumbersAllowed ) {
                            typedValue = typedValue.substr( 1, typedValue.length );
                        }
                    }

                    var obj = new Object();
                    obj.credentials = typedValue;
                    // this.sendPost( obj );
                    console.log('ENTER PRESSED');
                }

                //Blocking letters
                if( ! _allowedCharacters ) {
                    if ( keycode != BACKSPACE && keycode != GENERIC_KEYBOARD_EVENT &&
                        keycode < CHARACTERS_BEGIN || keycode > CHARACTERS_END ) {
                        return false;
                    }
                }
                console.log(typedValue);
                if( _allow_input_time) {
                    if (( keycode >= CHARACTERS_BEGIN && keycode <= CHARACTERS_END || keycode >= KEYPAD_BEGIN && keycode <= KEYPAD_END )
                        || ( keycode == RIGHT_ARROW || keycode == LEFT_ARROW || keycode == ENTER )) {
                        if (typedValue.length - 1 <= 0) {
                            _firstTime = _clock.getTime();

                        }
                        var finaldate = new Date().getTime();
                        console.log("time");
                        var result = finaldate - _firstTime;
                        console.log(result);
                        if (result >= _timing_to_input) {
                            warningField(_input);

                        }

                    }
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
        _input.on( 'keydown', function ( ) {
            clearTimeout( _typingTime);

        });
    } );





    /** DEFAULT CALLINGS **/
    this.blockScreenFocus();
    function warningField(element){
        if(element.parent().hasClass('has-warning') == false){
            var spanError = $('<span class="warning-span">Its not allowed</span>').addClass('help-block');
            element.parent().addClass("has-warning").append(spanError);

            setTimeout(function(){
                element.parent().removeClass('has-warning');
                element.parent().find('span.warning-span').remove();
                element.val('');
            }, _warning_message_timer);
        }
    }

}



