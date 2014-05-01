/**
 *
 */

App = Ember.Application.create();

App.Router.map(function() {
    this.route("service_details");
    this.route("my_account");
    this.route("preferences");
});

App.IndexRoute = Ember.Route.extend({
  model: function() {
    return ['red', 'yellow', 'blue'];
  }
});

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
