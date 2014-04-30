App = Ember.Application.create();

App.Router.map(function() {
    this.resource("service_details");
    this.resource("my_account");
    this.resource("preferences");
});

App.IndexRoute = Ember.Route.extend({
  model: function() {
    return ['red', 'yellow', 'blue'];
  }
});

App.ServiceDetailsView = Ember.View.extend({
    templateName: 'servicedetails'
});

App.MyAccountView = Ember.View.extend({
    templateName: 'my_account'
});

App.PreferencesView = Ember.View.extend({
    templateName: 'preferences'
});

App.ContextMenuComponent = Ember.Component.extend({
  classNames: ['row', 'contextmenu']
});

/*EOF*/
