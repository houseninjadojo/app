import EmberRouter from '@ember/routing/router';
import config from 'houseninja/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('login', function () {
    this.route('callback');
  });
  this.route('logout');
  this.route('signup');
  this.route('home');
  this.route('settings', function () {
    this.route('contact');
    this.route('payment');
    this.route('security');
    this.route('property');
  });
  this.route('contact-us');
  this.route('faq');
  this.route('work-history');
  this.route('handle-it');
});
