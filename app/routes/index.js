import Route from '@ember/routing/route';
import { service } from '@ember/service';

import isNativePlatform from 'houseninja/utils/is-native-platform';

export default class IndexRoute extends Route {
  @service session;
  @service router;

  beforeModel() {
    if (isNativePlatform()) {
      this.session.isAuthenticated
        ? this.router.transitionTo('home')
        : this.router.transitionTo('login-or-signup');
    } else {
      this.router.transitionTo('signup');
    }
  }
}
