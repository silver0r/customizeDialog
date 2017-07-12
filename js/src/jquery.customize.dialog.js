/*
customize dialog v1.0.0

(c) 2017 silver0r

dependency - jQuery >= 1.7.0
             magnific-popup(recommend lastest version)
             underscore(recommend lastest version)
MIT License
 */
(function ( factory ) {
    'use strict';

    if ( typeof contextPath === 'undefined' ) {
        window.contextPath = '';
    }

    // AMD
    if ( typeof define === 'function' && define.amd ) {
        define ( [ 'jquery', 'underscore' ], factory );
    }
    // CommonJS
    else if ( typeof exports === 'object' ) {
        module.exports = factory ( require ( 'jquery' ), require ( '_' ) );
    }
    // Browser globals
    else {
        factory ( jQuery, _ );
    }
} ( function ( $, _ ) {
    'use strict';

    var instance = null;
    var type = {
        info : 'info',
        confirm : 'confirm'
    };

    function CustomizeDialog ( options ) {
        this.defaults = {
            template : '/template/common/dialog.html',
            message : '',
            type : 'info',
            checkText : '확인',
            checkButtonId : 'btn_dialog_check01',
            cancelText : '취소',
            cancelButtonId : 'btn_dialog_cancel01',
            textAlign : 'center', // text-align: center, left, right
            enableIcon : true
        };

        this.options = $.extend ( {}, this.defaults, options );
        this.type = type;

        var deferred = $.Deferred ();

        this.init ( deferred );

        return deferred.promise ();
    }

    // CustomizeDialog init
    CustomizeDialog.prototype.init = function ( deferred ) {
        var that = this;

        // 이미 팝업이 띄어져있을 경우 추가 팝업 띄우지 않음
        if ( instance === null ) {
            $.get ( this.options.template ).done ( function ( template ) {
                that._magnificPopup ( deferred, template );
            } ).fail ( function () {
                alert ( that.options.message );
            } );
        }
    };

    // magnificPopup 생성
    CustomizeDialog.prototype._magnificPopup = function ( deferred, template ) {
        var that = this;

        var templateFunction = _.template ( template );
        var html = templateFunction ( {
            type : this.type,
            options : this.options
        } );

        $.magnificPopup.open ( {
            alignTop : false,
            modal : true,
            items : {
                src : html,
                type : 'inline'
            },
            callbacks : {
                open : function () {
                    that._event ( deferred );
                }
            }
        } );
    };

    // CustomizeDialog event
    CustomizeDialog.prototype._event = function ( deferred ) {
        var that = this;

        $ ( '#' + this.options.checkButtonId ).on ( 'click.customizeDialog', function () {
            deferred.resolve ( true );
            that._eventOff ();
            $.magnificPopup.close ();
        } );

        if ( this.options.type === this.type.confirm ) {
            $ ( '#' + this.options.cancelButtonId ).on ( 'click.customizeDialog', function () {
                deferred.resolve ( false );
                that._eventOff ();
                $.magnificPopup.close ();
            } );
        }
    };

    // event off
    CustomizeDialog.prototype._eventOff = function () {
        $ ( '#' + this.options.checkButtonId ).off ( '.customizeDialog' );

        if ( this.options.type === this.type.confirm ) {
            $ ( '#' + this.options.cancelButtonId ).off ( '.customizeDialog' );
        }

        instance = null;
    };

    $.customizeDialog = function ( options ) {
        instance = new CustomizeDialog ( options );
        return instance;
    };

} ));