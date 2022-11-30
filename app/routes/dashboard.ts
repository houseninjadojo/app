import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { AuthRoute } from 'houseninja/data/enums/routes';

import type Transition from '@ember/routing/transition';
import type SessionService from 'houseninja/services/session';
import type RouterService from '@ember/routing/router-service';
import { debug } from '@ember/debug';
import isNativePlatform from 'houseninja/utils/is-native-platform';

export default class DashboardRoute extends Route {
  @service declare router: RouterService;
  @service declare session: SessionService;

  async beforeModel(transition: Transition): Promise<void> {
    debug(
      `trying to access dashboard. authenticated=${this.session.isAuthenticated}`
    );
    if (!isNativePlatform()) {
      debug(
        'external session tried to access dashboard. invalidating & redirecting...'
      );
      if (this.session?.isAuthenticated) await this.session.invalidate();
      this.router.transitionTo(AuthRoute.LoginOrSignup);
    }
    await this.session.requireAuthentication(
      transition,
      AuthRoute.LoginOrSignup
    );
  }
}
