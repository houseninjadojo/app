import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class LogoutRoute extends Route {
  @service session;
  @service router;
  @service analytics;

  async beforeModel(transition) {
    this.session.requireAuthentication(transition, 'login-or-signup');
    await this.analytics.track('logout');
    await this.session.invalidate();
    await this.analytics.reset();
    this.router.transitionTo('index');
  }
}
