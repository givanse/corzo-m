/**
 *
 */
var app = {
    // Application Constructor
    initialize: function () {
        this.bindEvents();
    },

    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        // Phone
        document.addEventListener('deviceready', this.onDeviceReady, false);
        // Desktop
        //$(document).ready(function() { app.onDeviceReady(); });
    },
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function () {
        var ctxMenu$ = $("#contextmenu");

        $("#button-wrapper").click(function () { 
            ctxMenu$.animate({width: 'toggle'});
        });
        ctxMenu$.animate({width: 'toggle'});

        $("#contextmenu ul li").click(function () { 
            ctxMenu$.animate({width: 'toggle'});
        });
    }
};

/*EOF*/
