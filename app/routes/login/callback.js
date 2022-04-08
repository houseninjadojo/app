import Route from '@ember/routing/route';
import { service } from '@ember/service';
import isNativePlatform from 'houseninja/utils/is-native-platform';
import { Browser } from '@capacitor/browser';
import SecureStorage from 'houseninja/utils/secure-storage';
import { NATIVE_MOBILE_ROUTE } from 'houseninja/data/enums/routes';

export default class LoginCallbackRoute extends Route {
  @service session;
  @service router;

  queryParams = {
    code: { refreshModel: false },
    state: { refreshModel: false },
    error: { refreshModel: false },
  };

  /**
   * Handle loading a callback route:
   * `/login?state=1234abcd&code=1234abcd`
   */
  async model(params) {
    await SecureStorage.set('login', { state: 'callback' });
    if (params.code) {
      await this.closeBrowser();
      await this.session.authenticate(
        'authenticator:pkce',
        params.code,
        params.state
      );
      await SecureStorage.clear('login');
      this.router.transitionTo(NATIVE_MOBILE_ROUTE.DASHBOARD.HOME);
    }
  }

  async closeBrowser() {
    if (isNativePlatform()) {
      try {
        Browser.removeAllListeners();
        return await Browser.close();
      } catch {
        return null;
      }
    }
  }
}
