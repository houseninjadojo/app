import Route from '@ember/routing/route';
import { service } from '@ember/service';
import isNativePlatform from 'houseninja/utils/is-native-platform';
import { SplashScreen } from '@capacitor/splash-screen';
import { SIGNUP_ROUTE } from 'houseninja/data/enums/routes';

export default class LoginOrSignupRoute extends Route {
  @service current;
  @service session;
  @service router;

  beforeModel() {
    this.session.prohibitAuthentication('dashboard.home');
    if (!isNativePlatform()) {
      this.router.transitionTo(SIGNUP_ROUTE.INDEX);
    }
  }

  async model() {
    return this.current;
  }

  afterModel() {
    SplashScreen.hide();
  }
}
