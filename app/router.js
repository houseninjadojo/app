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
  // signup is distinct from onboarding
  // signup is for new customers who have no previous history with us
  this.route('signup', function () {
    this.route('area-notification');
    this.route('plan-selection');
    this.route('contact-info');
    this.route('payment-method');
    this.route('set-password');
    this.route('welcome');
    this.route('property-info');
    this.route('walkthrough-booking');
    this.route('booking-confirmation');
  });
  // onboarding is distinct from signup
  // onboarding is for customers who exist, but do not have an auth0 account yet
  this.route('onboarding', function () {
    this.route('contact-info');
    this.route('set-password', { path: 'onboarding/set-password/:user_id' });
    this.route('welcome');
    this.route('property-info', { path: 'onboarding/property-info/:user_id' });
    this.route('walkthrough-booking', {
      path: 'onboarding/walkthrough-booking/:user_id',
    });
    this.route('booking-confirmation');
  });
  this.route('settings', function () {
    this.route('contact');
    this.route('payment');
    this.route('security');
    this.route('property');
  });
  this.route('faq');
  this.route('vault', function () {
    this.route('index', { path: '/' });
    this.route('documents', function () {
      this.route('index');
      this.route('new');
      this.route('document', { path: '/:document_id' }, function () {
        this.route('edit');
      });
    });
    this.route('groups', function () {
      this.route('index');
      this.route('new');
      this.route('group', { path: '/:group_id' }, function () {
        this.route('edit');
      });
    });
  });
  this.route('work-orders', function () {
    this.route('index');
    this.route('work-order', { path: '/:work_order_id' });
  });
});
