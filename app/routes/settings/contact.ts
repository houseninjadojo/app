import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { DefaultRoute } from 'houseninja/data/enums/routes';

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
      DefaultRoute.SignedOut
    );
  }

  async model(): Promise<User> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const userId = this.session.data.authenticated.userinfo.user_id;
    return await this.store.findRecord('user', userId, {
      backgroundReload: true,
    });
  }
}
