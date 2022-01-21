import Route from '@ember/routing/route';
import { service } from '@ember/service';
import isNativePlatform from 'houseninja/utils/is-native-platform';
import { Browser } from '@capacitor/browser';
import { setUser } from '@sentry/capacitor';
import SecureStorage from 'houseninja/utils/secure-storage';

export default class LoginCallbackRoute extends Route {
  @service current;
  @service session;
  @service router;
  @service analytics;

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
      await this.identifyAndTrackUser();
      await this.current.load();
      this.router.transitionTo('home');
    }
  }

  async identifyAndTrackUser() {
    const userinfo = this.session.data.authenticated.userinfo;
    setUser({ id: userinfo.user_id, email: userinfo.email });
    await this.analytics.setProfile({
      // eslint-disable-next-line
      '$email': userinfo.email,
      // eslint-disable-next-line
      '$name': userinfo.name,
    });
    await this.analytics.identify(userinfo.email);
  }

  async closeBrowser() {
    if (isNativePlatform()) {
      try {
        return await Browser.close();
      } catch {
        return null;
      }
    }
  }
}
