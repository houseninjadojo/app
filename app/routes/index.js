import Route from '@ember/routing/route';
import { service } from '@ember/service';
export default class IndexRoute extends Route {
  @service session;
  @service router;

  beforeModel() {
    if (Capacitor.isNativePlatform()) {
      this.router.transitionTo('login-or-signup');
    } else {
      this.router.transitionTo('signup');
    }
  }
}
