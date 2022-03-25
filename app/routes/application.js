import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { instrumentRoutePerformance } from '@sentry/ember';
import { action } from '@ember/object';

class ApplicationRoute extends Route {
  @service analytics;
  @service current;
  @service intercom;
  @service session;
  @service router;
  @service loader;

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
    await this.intercom.setup();
    await this.session.setup();
    await this.analytics.setup();
    await this.analytics.track('Ember App Started');
  }

  async _trackPage() {
    const page = this.router.currentURL;
    const title = this.router.currentRouteName || 'unknown';
    await this.analytics.track('Page Visit', { page, title });
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
    await this.analytics.track('Click', {
      selector: queryString,
    });
  }

  @action
  loading(transition) {
    this.loader.showGlobalLoadingIndicator(transition);
  }
}

export default instrumentRoutePerformance(ApplicationRoute);
