import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { instrumentRoutePerformance } from '@sentry/ember';
import { action } from '@ember/object';
import isNativePlatform from 'houseninja/utils/is-native-platform';
import { SplashScreen } from '@capacitor/splash-screen';

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
    if (isNativePlatform()) {
      SplashScreen.show({
        fadeInDuration: 0,
        fadeOutDuration: 1000,
        showDuration: 1000,
        autoHide: false,
      });
    }
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
    if (isNativePlatform()) {
      SplashScreen.hide();
    }

    await this.analytics.setup();
    await this.analytics.track('Ember App Started');
  }

  async _trackPage() {
    const page = this.router.currentURL;
    const title = this.router.currentRouteName || 'unknown';
    await this.analytics.track('Page Visited', { page, title });
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
    return true;
  }
}

export default instrumentRoutePerformance(ApplicationRoute);
