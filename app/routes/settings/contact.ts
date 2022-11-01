import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { NATIVE_MOBILE_ROUTE } from 'houseninja/data/enums/routes';

import type CurrentService from 'houseninja/services/current';
import type StoreService from '@ember-data/store';
import type User from 'houseninja/models/user';
import type SessionService from 'houseninja/services/session';
import type Transition from '@ember/routing/transition';

export default class SettingsContactRoute extends Route {
  @service declare current: CurrentService;
  @service declare session: SessionService;
  @service declare store: StoreService;

  async beforeModel(transition: Transition): Promise<void> {
    return this.session.requireAuthentication(
      transition,
      NATIVE_MOBILE_ROUTE.AUTH.LOGIN_OR_SIGNUP
    );
  }

  async model(): Promise<User> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const userId = this.current.user.id;
    return await this.store.findRecord('user', userId, {
      backgroundReload: true,
    });
  }
}
