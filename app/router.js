import EmberRouter from '@ember/routing/router';
import config from 'houseninja/config/environment';

import isNativePlatform from 'houseninja/utils/is-native-platform';

export default class Router extends EmberRouter {
  // We need to use hash based location (`/#/some/page`) on mobile so that
  // app linking (`co.houseninja.application://#/some/page`) functions correctly
  location = isNativePlatform() ? 'hash' : 'history';
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('dashboard', function () {
    this.route('home');
    this.route('work-history');
    this.route('handle-it');
  });
  this.route('login-or-signup');
  this.route('login', function () {
    this.route('callback');
  });
  this.route('logout');
  this.route('signup', function() {
    this.route('area-notification');
    this.route('plan-selection');
    this.route('contact-info');
    this.route('payment-method');
    this.route('set-password');
    this.route('welcome');
  });
  this.route('settings', function () {
    this.route('contact');
    this.route('payment');
    this.route('security');
    this.route('property');
  });
  this.route('contact-us');
  this.route('faq');
});
