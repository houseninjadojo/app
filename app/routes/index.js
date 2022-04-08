import Route from '@ember/routing/route';
import { service } from '@ember/service';
import isNativePlatform from 'houseninja/utils/is-native-platform';
import {
  SIGNUP_ROUTE,
  NATIVE_MOBILE_ROUTE,
} from 'houseninja/data/enums/routes';

export default class IndexRoute extends Route {
  @service session;
  @service router;

  beforeModel() {
    // we are logged in
    // => go to dashboard.home
    if (this.session.isAuthenticated) {
      this.router.transitionTo(NATIVE_MOBILE_ROUTE.DASHBOARD.HOME);
      return;
    }

    // are we mobile or web?
    if (isNativePlatform()) {
      // we are NOT logged in
      // but we are on mobile
      // => go to login/signup page
      this.router.transitionTo('login-or-signup');
    } else {
      // we are NOT logged in
      // we are NOT on mobile
      // => go to signup page
      this.router.transitionTo(SIGNUP_ROUTE.INDEX);
    }
  }
}
