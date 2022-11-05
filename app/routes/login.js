import Route from '@ember/routing/route';
import { service } from '@ember/service';
import isNativePlatform from 'houseninja/utils/is-native-platform';
import { getOwner } from '@ember/application';
import SecureStorage from 'houseninja/utils/secure-storage';
import { NATIVE_MOBILE_ROUTE } from 'houseninja/data/enums/routes';

export default class LoginRoute extends Route {
  @service browser;
  @service eventBus;
  @service session;
  @service router;
  @service metrics;

  async beforeModel() {
    if (this.session.data.authenticated.kind !== 'payment-approval') {
      this.session.prohibitAuthentication(NATIVE_MOBILE_ROUTE.DASHBOARD.HOME);
    }

    const pkce = getOwner(this).lookup('authenticator:pkce');
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
      let url = await pkce.generateAuthorizationURL();
      this.metrics.trackEvent({ event: 'Login' });
      await this.nativeOpen(url);
    }

    // we are logged in
    if (this.session.isAuthenticated) {
      this.router.transitionTo(NATIVE_MOBILE_ROUTE.DASHBOARD.HOME);
    }
  }

  async loginState() {
    try {
      let data = await SecureStorage.get('login');
      return data;
    } catch {
      return Promise.resolve({});
    }
  }

  async nativeOpen(url) {
    if (isNativePlatform()) {
      this.eventBus.one('browser.browser-finished', () => {
        this.router.transitionTo(NATIVE_MOBILE_ROUTE.AUTH.LOGIN_OR_SIGNUP);
      });
      return await this.browser.open({ url, presentationStyle: 'popover' });
    } else {
      window.location.assign(url);
    }
  }
}
