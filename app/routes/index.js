import { Capacitor } from '@capacitor/core';
import Route from '@ember/routing/route';
import { service } from '@ember/service';
export default class IndexRoute extends Route {
  @service session;
  @service router;

  beforeModel() {
    if (Capacitor.isNativePlatform()) {
      if (this.session.isAuthenticated) {
        this.router.transitionTo('dashboard.home');
      } else {
        this.router.transitionTo('login-or-signup');
      }
    } else {
      this.router.transitionTo('signup');
    }
  }
}
