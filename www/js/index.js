/**
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        //document.addEventListener('deviceready', this.onDeviceReady, false);
        $(document).ready(function() {
            var ctxMenu$ = $("div#contextmenu");

            $("#contextmenu-button").click(function () { 
                ctxMenu$.animate({width: 'toggle'});
            });

            $("#contextmenu ul li").click(function () { 
                var li$ = $(this);
                li$.fadeTo(250, 0.1, function () {
                    ctxMenu$.animate({width: 'toggle'});
                    li$.fadeTo(1, 1);
                });
            });
        });
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
    }
};

/*EOF*/
