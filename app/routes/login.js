import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import isNativePlatform from 'dojo/utils/is-native-platform';
import { Browser } from '@capacitor/browser';
import { getOwner } from '@ember/application';

export default class LoginRoute extends Route {
  @service session;
  @service router;

  async beforeModel() {
    const pkce = getOwner(this).lookup('authenticator:pkce');
    const { state: loginState } = await this.loginState();

    // we are not logged in
    if (!this.session.isAuthenticated && loginState !== 'active') {
      pkce.clearStash();
      await pkce.stashData('login', { state: 'active' });
      let url = await pkce.generateAuthorizationURL();
      await this.nativeOpen(url);
    }
  }

  async loginState() {
    const pkce = getOwner(this).lookup('authenticator:pkce');
    try {
      return await pkce.unstashData('login');
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
