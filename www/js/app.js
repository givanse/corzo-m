/**
 *
 */

App = Ember.Application.create();

App.Router.map(function() {
    this.route("account");
    this.route("current_task");
    this.route("monitor");
    this.route("preferences");
});

/* Routes */

App.AccountRoute = Ember.Route.extend({
    model: function() {
        return fixtureDummyUser;
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

App.IndexController = Ember.Controller.extend({
    init: function () { 
        this._super();

        /* watch for GPS location updates periodically */
        var self = this;

        var geolocationError = function (error) {
            self.set('gpserror', error);
        };

        var successWrapper = function (position) {
            self.geolocationSuccess(position);
        };

        var options = 
            { maximumAge: 1000, timeout: 3000, enableHighAccuracy: true };
        var watchPositionId = navigator.geolocation.watchPosition(successWrapper, 
                                            geolocationError, 
                                            options);
    },

    initGoogleMap: function () {
        var mapOptions = {
            center: new google.maps.LatLng(20.674226, -103.387363),
            zoom: 16,
            maxZoom: 18,
            disableDefaultUI: true,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            zoomControl: false
        };
        var mapcanvasElem = document.getElementById("map-canvas");
        if ( ! mapcanvasElem ) {
            console.log('[error] MapController.initGoogleMap:' +
                        'There is no DOM element #map-canvas.');
        }
        var map = new google.maps.Map(mapcanvasElem, mapOptions);
        this.set('map', map);

        /* Add device marker */

        /*http://code.google.com/p/google-maps-utility-library-v3/wiki/Libraries*/
        //TODO: Remove library and use custom marker (if only this is being used)
        var GeoMarker = new GeolocationMarker();
        GeoMarker.setCircleOptions({fillColor: '#808080'});
        GeoMarker.setMap( this.get('map') );
    }, /* initGoogleMap */

    geolocationSuccess: function (position) {

        // Update the map
        if ( this.get('map') ) {
            var latlng = new google.maps.LatLng(position.coords.latitude,
                                                position.coords.longitude);
            this.get('map').setCenter( latlng );
        } else {
            console.log('[error] IndexController.geolocationSuccess:' +
                        'There is no map instance.');
        }

        function uploadPosition() {
            //TODO: upload position to the server
        }

        uploadPosition(position);

        var formattedGeoPos = {
            timestamp: '0 / 0 / 0 - 00:00',
            coords: {
                accuracy: '0',
                altitude: '0.0',
                altitudeAccuracy: '0',
                heading: '0.0',
                latitude: '0.000000',
                longitude: '0.000000',
                speed: '0'
            }
        };

        var c = position.coords;                           /* Just a shurtcut */
        var fc = formattedGeoPos.coords;                   /* Just a shurtcut */

        fc.accuracy = ( c.accuracy ? c.accuracy : fc.accuracy  ) + ' m'; 
        fc.altitude = ( c.altitude ? 
                        c.altitude.toFixed(2) : fc.altitude ) + ' m'; 
        fc.altitudeAccuracy = ( c.altitudeAccuracy ? 
                                c.altitudeAccuracy : 
                                fc.altitudeAccuracy  ) + ' m'; 
        fc.heading = ( c.heading ? c.heading.toFixed(2) : fc.heading  ); 
        fc.latitude = c.latitude ? c.latitude.toFixed(6) : fc.latitude ; 
        fc.longitude = c.longitude ? c.longitude.toFixed(6) : fc.longitude ; 
        if ( c.speed ) {
            var ms = c.speed.toFixed(2);
            var kmhr = (ms * 3600) / 1000;
            fc.speed = ms + ' m/s (' + kmhr + ' km/hr)'; 
        } else {
            fc.speed = fc.speed + ' m/s';   
        }

        var time = new Date( position.timestamp );
        var options = {
            weekday: "long", year: "numeric", month: "short",
            day: "numeric", hour: "2-digit", minute: "2-digit"
        };
        var date = time.toLocaleTimeString("es-mx", options);
        this.set('timestamp', date);
        this.set('coords', formattedGeoPos.coords);
    }, /* geolocationSuccess */

    map: null,                                        /* google map reference */

    message: function () {
        var err = this.get('model.gpserror');
        if ( err && err.code ) {
            return err.message + ', code: ' + err.code;
        } else {
            return 'ningun error';
        }
    }.property('gpserror')

}); /* IndexController */

/* Views */

App.ApplicationView = Ember.View.extend({
    classNames: ['ember-fulls-view']
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
    },
    gpserror: {
        message: null,
        code: null,
        PERMISSION_DENIED: null, 
        POSITION_UNAVAILABLE: null, 
        TIMEOUT: null
    }
};

var fixtureDummyUser = {
    name: 'Juan Camaney',
    cellphone: '33 1234 0000',
    license: '987654321',
    plate: 'abc 123'
};

/*EOF*/
