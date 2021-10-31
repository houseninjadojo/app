import Service, { inject as service } from '@ember/service';
import isNativePlatform from 'dojo/utils/is-native-platform';
import { App as MobileApp } from '@capacitor/app';
import { run } from '@ember/runloop';
import { Browser } from '@capacitor/browser';
// import ObjectProxy from '@ember/object/proxy';

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
    const route = this.router.recognize(url);
    if (route && route.name) {
      this.router.transitionTo(url);
    }
  }

  closeBrowser() {
    Browser.close().then(console.log).catch(console.error);
  }

  setupRouteHandler() {
    this.listener = MobileApp.addListener('appUrlOpen', (event) => {
      run(() => {
        // co.houseninja.app://page => /page
        let url = event.url.split('localhost:4200').pop();
        this.closeBrowser();
        this.forwardRoute(url);
      });
    });
  }
}
