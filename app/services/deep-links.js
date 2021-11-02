import Service, { inject as service } from '@ember/service';
import isNativePlatform from 'houseninja/utils/is-native-platform';
import { App as MobileApp } from '@capacitor/app';
import { run } from '@ember/runloop';
import { debug } from '@ember/debug';

/**
 * This service registers a listener to pick up incoming deep links.
 * Our app registers the deep link scheme `co.houseninja.app://`.
 *
 * This service listens to a deep link call to open our app, then
 * translates the request and forwards it to the ember router.
 *
 * In this way, both web native route requests (https://app.houseninja.co/some-page?query=param)
 * and mobile native route requests (co.houseninja.app://some-page?query=param)
 * are routed the same way.
 */
export default class DeepLinksService extends Service {
  @service router;

  listener = null;

  start() {
    if (isNativePlatform()) {
      this.setupRouteHandler();
    }
  }

  stop() {
    this.listener = null;
  }

  forwardRoute(url) {
    debug('url: ', url);
    let route = this.router.recognize(url.raw);
    debug('route: ' + route.name);
    this.router.transitionTo(url.raw);
  }

  parseUrl(url) {
    let parsed = new URL(url);
    let queryParams = Object.fromEntries(parsed.searchParams.entries());
    debug('deep link queryParams: ' + queryParams);
    let pathName = parsed.pathname;
    return {
      raw: `${parsed.pathname}${parsed.search}`,
      name: pathName,
      model: null, // perhaps later
      options: {
        queryParams,
      },
    };
  }

  setupRouteHandler() {
    this.listener = MobileApp.addListener('appUrlOpen', (event) => {
      run(() => {
        // co.houseninja.app://page => /page
        let url = this.parseUrl(event.url);
        // this.closeBrowser();
        this.forwardRoute(url);
      });
    });
  }
}
