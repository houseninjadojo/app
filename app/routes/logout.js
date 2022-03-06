import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class LogoutRoute extends Route {
  @service analytics;
  @service intercom;
  @service router;
  @service session;

  async beforeModel(transition) {
    this.session.requireAuthentication(transition, 'login-or-signup');
    await this.analytics.track('Logout');
    await this.session.invalidate();
    await this.analytics.reset();
    await this.intercom.logout();
    this.router.transitionTo('index');
  }
}
