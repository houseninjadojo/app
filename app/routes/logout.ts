import Route from '@ember/routing/route';
import { instrumentRoutePerformance } from '@sentry/ember';
import { service } from '@ember/service';

import type SessionService from 'houseninja/services/session';
import type Transition from '@ember/routing/transition';
import { DefaultRoute } from 'houseninja/data/enums/routes';

class LogoutRoute extends Route {
  @service declare session: SessionService;

  async beforeModel(transition: Transition): Promise<void> {
    await this.session.requireAuthentication(
      transition,
      DefaultRoute.SignedOut
    );
  }

  async model(): Promise<void> {
    await this.session.terminate();
  }
}

export default instrumentRoutePerformance(LogoutRoute);
