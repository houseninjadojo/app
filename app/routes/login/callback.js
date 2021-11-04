import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import isNativePlatform from 'houseninja/utils/is-native-platform';
import { Browser } from '@capacitor/browser';
import { getOwner } from '@ember/application';

export default class LoginCallbackRoute extends Route {
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
  async afterModel(_, transition) {
    const pkce = getOwner(this).lookup('authenticator:pkce');
    await pkce.stashData('login', { state: 'callback' });
    const queryParams = transition.to
      ? transition.to.queryParams
      : transition.queryParams;
    if (queryParams.code) {
      await this.closeBrowser();
      await this.session.authenticate(
        'authenticator:pkce',
        queryParams.code,
        queryParams.state
      );
      await pkce.clearStash('login');
      await this.identifyAndTrackUser();
      this.router.transitionTo('index');
    }
  }

  async identifyAndTrackUser() {
    const userinfo = this.session.data.authenticated.userinfo;
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
