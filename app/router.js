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
  this.route('p', function () {
    this.route('index');
    this.route('approve-payment', { path: 'approve-payment/:access_token' });
  });
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
  this.route('onboarding', function () {
    this.route('contact-info');
    this.route('set-password', { path: 'onboarding/set-password/:user_id' });
    this.route('welcome');
    this.route('property-info', { path: 'onboarding/property-info/:user_id' });
    this.route('walkthrough-booking');
    this.route('booking-confirmation');
  });
  this.route('settings', function () {
    this.route('contact');
    this.route('payment');
    this.route('security');
    this.route('property');
  });
  this.route('cancel-subscription', function () {
    this.route('index');
    this.route('confirmation');
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
