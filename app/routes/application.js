import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class ApplicationRoute extends Route {
  @service session;
  @service router;
  @service analytics;

  constructor() {
    super(...arguments);

    this.router.on('routeDidChange', async () => {
      await this._trackPage();
    });
  }

  async beforeModel() {
    await this.session.setup();
    await this.analytics.setup();

    await this.analytics.track('application_started');

    if (this.session.isAuthenticated) {
      const { email } = this.session.data.authenticated.userinfo;
      await this.analytics.identify(email);
    }
  }

  async _trackPage() {
    const page = this.router.currentURL;
    const title = this.router.currentRouteName || 'unknown';
    await this.analytics.track('page_visit', { page, title });
  }
}
