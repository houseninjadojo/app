import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { instrumentRoutePerformance } from '@sentry/ember';
import { action } from '@ember/object';
import isNativePlatform from 'houseninja/utils/is-native-platform';
import { SplashScreen } from '@capacitor/splash-screen';
import { schedule } from '@ember/runloop';

class ApplicationRoute extends Route {
  @service analytics;
  @service current;
  @service deepLinks;
  @service intercom;
  @service metrics;
  @service session;
  @service router;
  @service loader;
  @service storage;

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
    await this.storage.setup();
    await this.intercom.setup();
    await this.session.setup();
    // await this.metrics.install();
    this.deepLinks.setup();
  }

  afterModel() {
    if (isNativePlatform()) {
      SplashScreen.hide();
    }
  }

  async _trackPage() {
    schedule('afterRender', this, () => {
      const page = this.router.currentURL;
      const title = this.router.currentRouteName || 'unknown';
      this.metrics.trackPage({ page, title });
    });
  }

  /**
   * For every click or touchevent, generate a query selector
   * from the triggering DOM element and create an analytics event.
   * <div id="a" class="b c"></div> => `div.b.c#a`
   */
  async _trackClick(event) {
    schedule('afterRender', this, () => {
      const tag = event.target.localName;
      const classNames = event.target.className.replaceAll(' ', '.');
      const id = event.target.id;
      const selector = `${tag}.${classNames}${id.length > 0 ? '#' + id : ''}`;
      this.metrics.trackEvent({
        event: 'Click',
        properties: { selector },
      });
    });
  }

  @action
  loading(transition) {
    this.loader.setApplicationLoader(transition);
    return true;
  }
}

export default instrumentRoutePerformance(ApplicationRoute);
