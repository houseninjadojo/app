import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class LoginOrSignupRoute extends Route {
  @service current;
  @service session;
  @service router;

  async beforeModel() {
    if (this.session.isAuthenticated) {
      this.router.transitionTo('dashboard.home');
    }
  }

  async model() {
    return this.current;
  }
}
