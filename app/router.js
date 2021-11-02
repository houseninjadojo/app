import EmberRouter from '@ember/routing/router';
import config from 'app/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('login', function() {
    this.route('callback');
  });
  this.route('logout');
  this.route('signup');
  this.route('dashboard');
});
