import { Capacitor } from '@capacitor/core';
import Route from '@ember/routing/route';
import { service } from '@ember/service';
export default class IndexRoute extends Route {
  @service session;
  @service router;

  beforeModel() {
    if (this.session.isAuthenticated) {
      this.router.transitionTo('dashboard.home');
      return;
    }

    if (Capacitor.isNativePlatform()) {
      this.router.transitionTo('login-or-signup');
    } else {
      this.router.transitionTo('signup');
    }
  }
}
