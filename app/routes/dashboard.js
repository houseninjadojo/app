import Route from '@ember/routing/route';
import { service } from '@ember/service';
import isNativePlatform from 'houseninja/utils/is-native-platform';
import { SplashScreen } from '@capacitor/splash-screen';
export default class DashboardRoute extends Route {
  @service session;

  beforeModel(transition) {
    this.session.requireAuthentication(transition, 'login-or-signup');
  }
  afterModel() {
    if (isNativePlatform()) {
      SplashScreen.hide();
    }
  }
}
