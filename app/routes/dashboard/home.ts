import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { isBlank } from '@ember/utils';
import RSVP from 'rsvp';
import { NATIVE_MOBILE_ROUTE } from 'houseninja/data/enums/routes';
import type SessionService from 'houseninja/services/session';
import type StoreService from '@ember-data/store';
import type Transition from '@ember/routing/transition';

export default class DashboardHomeRoute extends Route {
  @service declare current: any;
  @service declare session: SessionService;
  @service declare store: StoreService;

  beforeModel(transition: Transition): void {
    this.session.requireAuthentication(
      transition,
      NATIVE_MOBILE_ROUTE.AUTH.LOGIN_OR_SIGNUP
    );
  }

  async model(): Promise<object> {
    const userId = this.session?.data?.authenticated?.userinfo?.user_id;
    let user = null;
    let property = null;

    if (isBlank(this.current.user)) {
      user = await this.store.findRecord('user', userId, {
        include: 'properties',
      });
      const properties = await user.get('properties');
      property = properties[0];
    } else {
      const properties = await this.current.user.get('properties');
      property = properties[0];
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
