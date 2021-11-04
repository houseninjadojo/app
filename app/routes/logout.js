import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class LogoutRoute extends Route {
  @service session;
  @service router;
  @service analytics;

  async beforeModel() {
    await this.analytics.track('logout');
    await this.session.invalidate();
    await this.analytics.reset();
    this.router.transitionTo('index');
  }
}
