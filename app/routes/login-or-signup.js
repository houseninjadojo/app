import Route from '@ember/routing/route';
import { service } from '@ember/service';
import isNativePlatform from 'houseninja/utils/is-native-platform';

export default class LoginOrSignupRoute extends Route {
  @service current;
  @service session;
  @service router;

  beforeModel() {
    this.session.prohibitAuthentication('dashboard.home');
    if (!isNativePlatform()) {
      this.router.transitionTo('signup');
    }
  }

  async model() {
    return this.current;
  }
}
