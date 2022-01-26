import Route from '@ember/routing/route';
import { service } from '@ember/service';
import Sentry from '@sentry/capacitor';

export default class ApplicationRoute extends Route {
  @service analytics;
  @service chat;
  @service current;
  @service router;
  @service session;
  @service('ember-user-activity@user-activity') userActivity;

  constructor() {
    super(...arguments);

    this.router.on('routeDidChange', async () => {
      await this._trackPage();
    });

    this.userActivity.on('touchstart', this, async (event) => {
      await this._trackClick(event);
    });
  }

  async beforeModel() {
    this.chat.setup();
    await this.session.setup();
    await this.analytics.setup();
    await this.current.load();

    await this.analytics.track('application_started');

    if (this.session.isAuthenticated) {
      const { email } = this.session.data.authenticated.userinfo;
      Sentry.setUser({ email });
      await this.analytics.identify(email);
      await this.chat.login();
      await this.chat.updateUser();
    }
  }

  async _trackPage() {
    const page = this.router.currentURL;
    const title = this.router.currentRouteName || 'unknown';
    await this.analytics.track('page_visit', { page, title });
  }

  /**
   * For every click or touchevent, generate a query selector
   * from the triggering DOM element and create an analytics event.
   * <div id="a" class="b c"></div> => `div.b.c#a`
   */
  async _trackClick(event) {
    const tag = event.target.localName;
    const classNames = event.target.className.replaceAll(' ', '.');
    const id = event.target.id;
    const queryString = `${tag}.${classNames}${id.length > 0 ? '#' + id : ''}`;
    await this.analytics.track('click', {
      selector: queryString,
    });
  }
}
