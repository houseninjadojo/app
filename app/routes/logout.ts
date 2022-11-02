import Route from '@ember/routing/route';
import { service } from '@ember/service';

import type SessionService from 'houseninja/services/session';

export default class LogoutRoute extends Route {
  @service declare session: SessionService;

  async beforeModel(): Promise<void> {
    this.session.invalidate();
  }
}
