import Route from '@ember/routing/route';
import { service } from '@ember/service';
import isNativePlatform from 'houseninja/utils/is-native-platform';
import { DefaultRoute } from 'houseninja/data/enums/routes';
import CurrentService from 'houseninja/services/current';
import SessionService from 'houseninja/services/session';
import RouterService from '@ember/routing/router-service';

export default class LoginOrSignupRoute extends Route {
  @service declare current: CurrentService;
  @service declare session: SessionService;
  @service declare router: RouterService;

  beforeModel(): void {
    if (!this.session.isExternalSession) {
      this.session.prohibitAuthentication(DefaultRoute.SignedIn);
    }
    if (!isNativePlatform()) {
      this.router.transitionTo(DefaultRoute.Signup);
    }
    this.router.transitionTo(DefaultRoute.SignedOut);
  }

  async model(): Promise<CurrentService> {
    return this.current;
  }
}
