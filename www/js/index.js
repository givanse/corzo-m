/**
 * 
 */

var App = Ember.Application.create();
App.deferReadiness();

var phonegap = {
    // Application Constructor
    initialize: function () {
        this.bindEvents();
    },

    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function () {
        App.advanceReadiness();
    }
};

App.Router.map(function() {
    this.route("account");
    this.route("current_task");
    this.route("monitor");
    this.route("preferences");
});

/* Routes */

App.AccountRoute = Ember.Route.extend({
    model: function() {
        var fixtureDummyUser = {
            name: 'Enrique P. Nieto',
            cellphone: '33 1234 0000',
            license: '987654321',
            plate: 'abc 123'
        };

        return { user: fixtureDummyUser,
                 device: device };
    }
});

App.IndexRoute = Ember.Route.extend({
    model: function() {
        return fixtureDefaultModel;
    }
});

App.MonitorRoute = Ember.Route.extend({
    /* This allow us to share the same model with the MapRoute. */
    controllerName: 'index'
});

/* Controllers */

App.ApplicationController = Ember.Controller.extend({
    driverStatus: 'Inactivo' 
});

/**
 * Code roadmap:
 *
 * IndexController
 *     init()
 *         watchPosition()          <- asynchronous interval
 *             geolocationSuccess()
 *                 updateMap() 
 *
 * IndexView
 *     didInsertElement()
 *         IndexController
 *             initGoogleMap()
 *                 tilesloaded
 *                     initGoogleMapCtrls()
 *                        updateMap() 
 */
App.IndexController = Ember.Controller.extend({

    centerMap: function () {
        var pos = this.get('position');
        var latlng = new google.maps.LatLng(pos.coords.latitude,
                                            pos.coords.longitude);
        this.get('map').setCenter( latlng );
    },

    formatPosition: function (position) {
        var formattedGeoPos = {
            timestamp: '0 / 0 / 0 - 00:00',
            coords: {
                accuracy: '0',
                altitude: '0.0',
                altitudeAccuracy: '0',
                heading: '0.0',
                latitude: '0.000000',
                longitude: '0.000000',
                speed: '0 km/hr'
            }
        };

        // timestamp
        var time = new Date( position.timestamp );
        var options = {
            weekday: "long", year: "numeric", month: "short",
            day: "numeric", hour: "2-digit", minute: "2-digit"
        };
        formattedGeoPos.timestamp = time.toLocaleTimeString("es-mx", options);

        // coords
        var c = position.coords;
        var fc = formattedGeoPos.coords;
 
        fc.accuracy = ( c.accuracy ? c.accuracy.toFixed(2) : 
                                     fc.accuracy ) + ' m'; 
        fc.altitude = ( c.altitude ? 
                        c.altitude.toFixed(2) : fc.altitude ) + ' m'; 
        fc.altitudeAccuracy = ( c.altitudeAccuracy ? 
                                c.altitudeAccuracy : 
                                fc.altitudeAccuracy  ) + ' m'; 
        fc.heading = ( c.heading ? c.heading.toFixed(2) : fc.heading  ) + '°'; 
        fc.latitude = c.latitude ? c.latitude.toFixed(6) : fc.latitude ; 
        fc.longitude = c.longitude ? c.longitude.toFixed(6) : fc.longitude ; 
        if ( c.speed ) {
            var ms = c.speed;
            var kmhr =  ( (ms * 3600) / 1000 ).toFixed(2);
            fc.speed = kmhr + ' km/hr';
        } 

        return formattedGeoPos;
    }, /* formatPosition */

    geolocationSuccess: function (position) {
        console.log('geolocationSuccess');
        if ( ! this.get('map') ) {
            console.log('[error] IndexController.geolocationSuccess:' +
                        'There is no map instance.');
            return;
        }

        this.set('position', position);

        this.logPositionToServer(position);

        var formattedGeoPos = this.formatPosition(position);
        this.set('timestamp', formattedGeoPos.timestamp);
        this.set('coords', formattedGeoPos.coords);

        this.updateMap();
    }, /* geolocationSuccess */

    gpserror: {
        message: null,
        code: null,
        PERMISSION_DENIED: null, 
        POSITION_UNAVAILABLE: null, 
        TIMEOUT: null
    },

    init: function () { 
        this._super();

        /* watch for GPS location updates periodically */
        var self = this;

        var geolocationError = function (error) {
            console.log('geolocationError');
            console.log(error);
            self.set('gpserror', error);
        };

        var successWrapper = function (position) {
            self.geolocationSuccess(position);
        };

        var options = 
            { maximumAge: 1000, timeout: 3000, enableHighAccuracy: true };
        navigator.geolocation.watchPosition(successWrapper, 
                                            geolocationError, 
                                            options);
    },

    initGoogleMap: function () {
        var mapOptions = {
            center: new google.maps.LatLng(20.674226, -103.387363),
            zoom: 18,
            disableDefaultUI: true,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            zoomControl: false
        };
        var mapcanvasElem = document.getElementById("map-canvas");
        if ( ! mapcanvasElem ) {
            console.log('[error] IndexController.initGoogleMap: ' +
                        'There is no DOM element #map-canvas.');
        }
        var map = new google.maps.Map(mapcanvasElem, mapOptions);
        this.set('map', map);

        var self = this;
        google.maps.event.addListenerOnce(map, "tilesloaded", function () {
            self.initGoogleMapComponents();
        });
    },

    initGoogleMapComponents: function () {
        console.log('initGoogleMapCtrls: tiles loaded');

        var map = this.get('map');
        var locMarker = GPSMap.Marker.createLocationArrow(map);
        this.set('currLocMarker', locMarker);

        var self = this;

        var geolocateCtrl = GPSMap.Control.createGeolocate();
        google.maps.event.addDomListener(geolocateCtrl, 'click', function() {
            self.centerMap();
        });
        map.controls[google.maps.ControlPosition.RIGHT_BOTTOM]
           .push(geolocateCtrl);
        
        this.updateMap();
    }, /* initGoogleMapCtrls */

    logPositionToServer: function () {
        console.log('logPositionToServer');
        //TODO
    },

    map: null,                                        /* google map reference */

    message: function () {
        var err = this.get('gpserror');
        if ( err && err.code ) {
            return err.message + ', code: ' + err.code;
        } else {
            return 'ok';
        }
    }.property('gpserror'),

    updateMap: function () {
        console.log('updateMap');

        var position = this.get('position');
        if ( ! position ) {
            console.log('[warning] IndexController.updateMap: ' +
                        'There is no position.');
            return;
        }
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;
        console.log(lat + ', ' + lng);

        var locMarker = this.get('currLocMarker');
        if ( ! locMarker ) {
            console.log('[warning] IndexController.updateMap: ' +
                        'There is no location marker.');
            return;
        }

        locMarker.update(lat, lng, 
                         position.coords.accuracy,
                         position.coords.heading);

        if ( ! locMarker.isVisibleOnMap() ) {
            this.centerMap();
        }
    }

}); /* IndexController */

/** 
 * Views 
 */

App.ApplicationView = Ember.View.extend({
    classNames: ['ember-fulls-view'],
    didInsertElement: function () {

        /**
         * Context menu SVG button
         */
        var embed = document.querySelector("#svg-obj embed");
        var overlay = $("#svg-overlay");

        embed.onload = function () {
            var rect = this.getSVGDocument().querySelector("svg rect");

            // TODO: make this work, for now the overlay div is the workaround
            //$(rect).trigger("touchstart");

            overlay.on("touchstart", function () {
                $(rect).attr("class", "touched");
            });

            overlay.on("touchend", function () {
                $(rect).attr("class", "normal");
                $("#contextmenu").animate({width: 'toggle'});
            });
        }; /* embed.onload */

        /**
         * Select status 
         */
        var sel = $("#driverstatus .select");
        sel.on("touchstart", function () {
            sel.addClass("select-touched");
        });
        sel.on("touchleave", function () {
            sel.removeClass("select-touched");
        });
        sel.on("touchend", function () {
            sel.removeClass("select-touched");
            var buttonLabels = [];
            buttonLabels[0] = "Libre";
            buttonLabels[1] = "Trabajando";
            buttonLabels[2] = "Ocupado";
            function handleStatusChange(buttonIndex) {
                //TODO
            };
            navigator.notification.confirm(" ", null, "Confirmar Estado Nuevo", 
                                           buttonLabels);
        });
        
    } /* didInsertElement */
});

App.ExitView = Ember.View.extend({
    tagName: 'li',
    click: function () {
        navigator.app.exitApp();
    },
    didInsertElement: function () {
        var li = this.get('element');
        var a = $(li).find('a');

        $(a).on("touchstart", function (e) { 
            $(a).addClass("touched");
        });

        $(a).bind("touchcancel touchleave", function (e) { 
            $(a).removeClass("touched");
        });
    }
});

App.MonitorView = App.IndexView = Ember.View.extend({
    classNames: ['ember-fulls-view'],
    didInsertElement: function() {
        /* There are two #map-canvas, one in each view, but both views share
           the same controller (IndexController). So, each time we swap views
           a new google map is created and the old one overwritten. 
           TODO: Review the performance toll. */
        this.get('controller').initGoogleMap();
    }
});

/** 
 * Components 
 */

App.CtxMenuItemComponent = Ember.Component.extend({
    tagName: 'li',
    didInsertElement: function () {
        var li = this.get('element');
        var a = $(li).find('a');

        $(a).on("touchstart", function (e) { 
            $(a).addClass("touched");
        });

        $(a).bind("touchcancel touchleave", function (e) { 
            $(a).removeClass("touched");
        });

        $(a).on("touchend", function (e) { 
            $(a).removeClass("touched");
            $("#contextmenu").animate({width: 'toggle'});
            a.trigger("click");
        });
    } /* didInsertElement */
});

App.DataRowComponent = Ember.Component.extend({
    tagName: 'div',
    className: ['data-row']
});

/* Fixtures */

var fixtureDefaultModel = {
    timestamp: 0, 
    coords: {
        accuracy: 0,                                                     /* m */
        altitude: 0,                                                     /* m */
        altitudeAccuracy: 0,                                             /* m */
        heading: 'NA',        /* clockwise degrees relative to the true north */
        latitude: 90.000000,                               /* decimal degrees */
        longitude: 0.000000,                               /* decimal degrees */
        speed: 0                                                       /* m/s */ 
    }
};

/*EOF*/
