import Route from '@ember/routing/route';
import { service } from '@ember/service';
import isNativePlatform from 'houseninja/utils/is-native-platform';
import { Browser } from '@capacitor/browser';
import { getOwner } from '@ember/application';
import SecureStorage from 'houseninja/utils/secure-storage';

export default class LoginRoute extends Route {
  @service session;
  @service router;
  @service analytics;

  async beforeModel() {
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
      await this.analytics.track('login');
      await this.nativeOpen(url);
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
      return await Browser.open({ url, presentationStyle: 'popover' });
    } else {
      window.location.assign(url);
    }
  }
}
