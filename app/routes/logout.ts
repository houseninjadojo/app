import Route from '@ember/routing/route';
import { service } from '@ember/service';

import type SessionService from 'houseninja/services/session';
import type Transition from '@ember/routing/transition';
import { NATIVE_MOBILE_ROUTE } from 'houseninja/data/enums/routes';

export default class LogoutRoute extends Route {
  @service declare session: SessionService;

  async beforeModel(transition: Transition): Promise<void> {
    await this.session.requireAuthentication(
      transition,
      NATIVE_MOBILE_ROUTE.AUTH.LOGIN_OR_SIGNUP
    );
  }

  async model(): Promise<void> {
    await this.session.terminate();
  }
}
