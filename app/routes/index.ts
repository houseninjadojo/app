import Route from '@ember/routing/route';
import { service } from '@ember/service';
import isNativePlatform from 'houseninja/utils/is-native-platform';
import { DefaultRoute } from 'houseninja/data/enums/routes';
import SessionService from 'houseninja/services/session';
import RouterService from '@ember/routing/router-service';

export default class IndexRoute extends Route {
  @service declare session: SessionService;
  @service declare router: RouterService;

  beforeModel(): void {
    // redirect to dashboard when logged in, except for when we authed for external payment page
    if (this.session.isAuthenticated && !this.session.isExternalSession) {
      this.router.transitionTo(DefaultRoute.SignedIn);
      return;
    }

    // we are logged in
    // => go to dashboard.home

    // are we mobile or web?
    if (isNativePlatform()) {
      // we are NOT logged in
      // but we are on mobile
      // => go to login/signup page
      this.router.transitionTo(DefaultRoute.SignedOut);
    } else {
      // we are NOT logged in
      // we are NOT on mobile
      // => go to signup page
      this.router.transitionTo(DefaultRoute.Signup);
    }
  }
}
