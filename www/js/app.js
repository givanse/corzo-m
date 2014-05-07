/**
 *
 */

App = Ember.Application.create();

App.Router.map(function() {
    this.route("service_details");
    this.route("my_account");
    this.route("preferences");
});

var dummyUser = {
    name: 'Juan Camaney',
    cellphone: '33 1234 0000',
    license: '987654321',
    plate: 'abc 123'
};

App.MyAccountRoute = Ember.Route.extend({
    model: function() {
        return dummyUser;
    }
});

/* Controllers */

App.MyAccountController = Ember.Controller.extend({
    geopos: {
        timestamp: 0, 
        coords: {
            accuracy: 0,
            altitude: 0,
            altitudeAccuracy: 0,
            heading: 'NA',
            latitude: 90.000000,
            longitude: 0.000000,
            speed: 0 
        }
    },

    gpserror: {
        message: "ningun error",
        code: null,
        PERMISSION_DENIED: null, 
        POSITION_UNAVAILABLE: null, 
        TIMEOUT: null
    },

    init: function() { 
        this._super();
        var self = this;
        var geolocationSuccess = function (position) {
            self.set('geopos', position);
            self.set('gpserror', null);
        };
        var geolocationError = function (error) {
            self.set('gpserror', error);
        };
        navigator.geolocation.watchPosition(geolocationSuccess,
                                            geolocationError,
                                            {maximumAge: 1000, 
                                             timeout: 2000, 
                                             enableHighAccuracy: true});
        
    },

    message: function () {
        var err = this.get('gpserror');
        return ( err && err.code ) ?
                 'Error: ' + err.code + ', ' + err.message : ''; 
    }.property('gpserror')
});

/* Views */

App.IndexView = Ember.View.extend({
    didInsertElement: function() {
        App.hideContextMenu();
    }
});

App.ServiceDetailsView = Ember.View.extend({
});

App.MyAccountView = Ember.View.extend({
    didInsertElement: function() {
        App.hideContextMenu();
    }
});

App.PreferencesView = Ember.View.extend({
    didInsertElement: function() {
        App.hideContextMenu();
    }
});

App.ContextMenuComponent = Ember.Component.extend({
});

App.hideContextMenu = function () {
    //$("div#contextmenu").hide();
    //$("div#contextmenu div:first-child").animate({width: 'toggle'});
};

/*EOF*/
