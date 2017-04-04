/**
 * Created by root on 25/01/17.
 */


function showMessage(msg, state){
    var template, icon;
    template = '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0}" role="alert">' +
                '<span aria-hidden="true" class="close" data-notify="dismiss">&times;</span>' +
                '<span data-notify="icon"></span> ' +
                '<span data-notify="message">{2}</span>' +
            '</div>';

        switch (state){
            case 'success':
                icon = 'fa fa-check fa-lg';
                break;
            case 'error':
                icon = 'fa fa-times fa-lg';
                state = 'danger';
                break;
            case 'warning':
                icon = 'fa fa-exclamation-triangle fa-lg';
                break;


        }
    $.notify({
        message: msg,
        icon: icon,
    },{
        animate: {
            enter: 'animated fadeInDown',
            exit: 'animated fadeOutUp'
        },
        type: state,
        placement: {
            from: "bottom",
            align: "right"
        },
        delay: 700,
        time: 2300,
        allow_dismiss: true,
        icon_type: 'class',
        template: template
    });

}