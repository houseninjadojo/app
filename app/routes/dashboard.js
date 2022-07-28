import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { isBlank } from '@ember/utils';
import RSVP from 'rsvp';
import { NATIVE_MOBILE_ROUTE } from 'houseninja/data/enums/routes';

export default class DashboardRoute extends Route {
  @service current;
  @service session;
  @service store;

  beforeModel(transition) {
    this.session.requireAuthentication(
      transition,
      NATIVE_MOBILE_ROUTE.AUTH.LOGIN_OR_SIGNUP
    );
  }

  async model() {
    const userId = this.session?.data?.authenticated?.userinfo?.user_id;
    let user = null;
    let property = null;

    if (isBlank(this.current.user)) {
      user = await this.store.findRecord('user', userId, {
        include: 'properties',
      });
      property = user.get('properties.firstObject');
    } else {
      property = this.current.user.get('properties.firstObject');
    }

    return RSVP.hash({
      property: this.current.property || property
    });
  }
}
