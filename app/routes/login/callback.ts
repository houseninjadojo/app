import Route from '@ember/routing/route';
import { service } from '@ember/service';
import isNativePlatform from 'houseninja/utils/is-native-platform';
import SecureStorage from 'houseninja/utils/secure-storage';
import { DefaultRoute } from 'houseninja/data/enums/routes';
import BrowserService from 'houseninja/services/browser';
import SessionService from 'houseninja/services/session';
import RouterService from '@ember/routing/router-service';

type QueryParams = {
  code: string;
  state: string;
  error: string;
};

export default class LoginCallbackRoute extends Route {
  @service declare browser: BrowserService;
  @service declare session: SessionService;
  @service declare router: RouterService;

  queryParams = {
    code: { refreshModel: false },
    state: { refreshModel: false },
    error: { refreshModel: false },
  };

  /**
   * Handle loading a callback route:
   * `/login?state=1234abcd&code=1234abcd`
   */
  async model(params: QueryParams): Promise<void> {
    await SecureStorage.set('login', { state: 'callback' });
    if (params.code) {
      await this.closeBrowser();
      await this.session.authenticate(
        'authenticator:pkce',
        params.code,
        params.state
      );
      await SecureStorage.clear('login');
      this.router.transitionTo(DefaultRoute.SignedIn);
    }
  }

  async closeBrowser() {
    if (isNativePlatform()) {
      try {
        return await this.browser.close();
      } catch {
        return null;
      }
    }
  }
}
