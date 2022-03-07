import Route from '@ember/routing/route';
import { service } from '@ember/service';
import isNativePlatform from 'houseninja/utils/is-native-platform';
import { Browser } from '@capacitor/browser';
import { SplashScreen } from '@capacitor/splash-screen';

export default class LogoutRoute extends Route {
  @service analytics;
  @service intercom;
  @service router;
  @service session;

  async beforeModel(transition) {
    SplashScreen.show({
      fadeInDuration: 0,
      fadeOutDuration: 1000,
      showDuration: 1000,
      autoHide: false,
    });
    this.session.requireAuthentication(transition, 'login-or-signup');
    await this.analytics.track('Logout');
    await this.session.invalidate();
    await this.analytics.reset();
    await this.intercom.logout();
    await this.closeBrowser();
    this.router.transitionTo('index');
  }

  async closeBrowser() {
    if (isNativePlatform()) {
      try {
        Browser.removeAllListeners();
        await Browser.close();
        return SplashScreen.hide();
      } catch {
        return SplashScreen.hide();
      }
    }
  }
}
