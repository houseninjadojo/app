import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import isNativePlatform from 'dojo/utils/is-native-platform';
import { Browser } from '@capacitor/browser';
import { getOwner } from '@ember/application';
export default class LoginRoute extends Route {
  @service session;

  queryParams = {
    code: { refreshModel: false },
    state: { refreshModel: false },
    error: { refreshModel: false },
  };

  url = null;

  // @service auth;

  async beforeModel() {
    const pkce = getOwner(this).lookup('authenticator:pkce');
    const hasLoginData = await pkce.loginDataExists();
    // pkce.clearStash();
    if (!hasLoginData) {
      const url = await pkce.generateAuthorizationURL();
      await this.nativeOpen(url);
    }
  }

  async afterModel(_, transition) {
    const queryParams = transition.to
      ? transition.to.queryParams
      : transition.queryParams;
    if (queryParams.code) {
      await this.session.authenticate(
        'authenticator:pkce',
        queryParams.code,
        queryParams.state
      );
      this.transitionTo('index');
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
