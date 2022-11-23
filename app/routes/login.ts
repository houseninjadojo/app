import Route from '@ember/routing/route';
import { service } from '@ember/service';
import isNativePlatform from 'houseninja/utils/is-native-platform';
import { getOwner } from '@ember/application';
import SecureStorage from 'houseninja/utils/secure-storage';
import { DefaultRoute } from 'houseninja/data/enums/routes';
import PKCEAuthenticator from 'houseninja/authenticators/pkce';
import BrowserService from 'houseninja/services/browser';
import EventBusService from 'houseninja/services/event-bus';
import SessionService from 'houseninja/services/session';
import RouterService from '@ember/routing/router-service';
import MetricsService from 'houseninja/services/metrics';

export default class LoginRoute extends Route {
  @service declare browser: BrowserService;
  @service declare eventBus: EventBusService;
  @service declare session: SessionService;
  @service declare router: RouterService;
  @service declare metrics: MetricsService;

  async beforeModel(): Promise<void> {
    if (!this.session.isExternalSession) {
      this.session.prohibitAuthentication(DefaultRoute.SignedIn);
    }

    const pkce: PKCEAuthenticator = getOwner(this).lookup(
      'authenticator:pkce'
    ) as PKCEAuthenticator;
    const { state: loginState } = await this.loginState();

    // forward to the callback route
    if (!this.session.isAuthenticated && loginState == 'callback') {
      await SecureStorage.clear('login');
      return;
    }

    // we are not logged in
    if (!this.session.isAuthenticated && loginState !== 'active') {
      await SecureStorage.clear('login');
      await SecureStorage.set('login', { state: 'active' });
      const url = await pkce.generateAuthorizationURL();
      this.metrics.trackEvent({ event: 'Login' });
      await this.nativeOpen(url);
    }

    // we are logged in
    if (this.session.isAuthenticated) {
      this.router.transitionTo(DefaultRoute.SignedIn);
    }
  }

  async loginState(): Promise<{ state?: string }> {
    try {
      return await SecureStorage.get('login');
    } catch {
      return Promise.resolve({});
    }
  }

  async nativeOpen(url: string): Promise<void> {
    if (isNativePlatform()) {
      this.eventBus.one('browser.browser-finished', () => {
        this.router.transitionTo(DefaultRoute.SignedOut);
      });
      return await this.browser.open({ url, presentationStyle: 'popover' });
    } else {
      window.location.assign(url);
    }
  }
}
