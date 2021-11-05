import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { Browser } from '@capacitor/browser';
import { getOwner } from '@ember/application';

export default class LogoutRoute extends Route {
  @service session;
  @service router;
  @service analytics;

  async beforeModel() {
    await this.analytics.track('logout');
    await this.logoutExternal();
    await this.session.invalidate();
    await this.analytics.reset();
    this.router.transitionTo('index');
  }

  async logoutExternal() {
    Browser.addListener('browserPageLoaded', () => {
      Browser.close();
    });
    await Browser.open({
      url: this.logoutUrl(),
      presentationStyle: 'popover',
    });
  }

  logoutUrl() {
    const pkce = getOwner(this).lookup('authenticator:pkce');
    return pkce.logoutEndpoint;
  }
}
