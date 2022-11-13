import Route from '@ember/routing/route';
import { service } from '@ember/service';

import type SessionService from 'houseninja/services/session';
import type Transition from '@ember/routing/transition';
import { DefaultRoute } from 'houseninja/data/enums/routes';

export default class LogoutRoute extends Route {
  @service declare session: SessionService;

  async beforeModel(transition: Transition): Promise<void> {
    await this.session.requireAuthentication(
      transition,
      DefaultRoute.SignedOut
    );
  }

  async model() {
    await this.session.terminate();
  }
}
