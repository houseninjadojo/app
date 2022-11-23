import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { isBlank } from '@ember/utils';
import RSVP from 'rsvp';
import { NATIVE_MOBILE_ROUTE } from 'houseninja/data/enums/routes';

import type CurrentService from 'houseninja/services/current';
import type SessionService from 'houseninja/services/session';
import type StoreService from 'houseninja/services/store';
import type Transition from '@ember/routing/transition';
import type UserModel from 'houseninja/models/user';
import type PropertyModel from 'houseninja/models/property';

export default class DashboarHomeRoute extends Route {
  @service declare current: CurrentService;
  @service declare session: SessionService;
  @service declare store: StoreService;

  beforeModel(transition: Transition) {
    this.session.requireAuthentication(
      transition,
      NATIVE_MOBILE_ROUTE.AUTH.LOGIN_OR_SIGNUP
    );
  }

  async model() {
    const userId = this.session?.data?.authenticated?.userinfo?.user_id;
    let user: UserModel | undefined;
    let property: PropertyModel | undefined;

    if (isBlank(this.current.user) && userId) {
      user = await this.store.findRecord('user', userId, {
        include: 'properties',
      });
      const properties = await user?.properties;
      property = properties?.firstObject;
    } else {
      const properties = await this.current.user?.properties;
      property = properties?.firstObject;
    }

    return RSVP.hash({
      user: this.current.user || user,
      property,
      commonRequests: this.store.findAll('common-request', {
        backgroundReload: true,
      }),
      homeCareTips: this.store.findAll('home-care-tip', {
        backgroundReload: true,
      }),
    });
  }
}
