import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { isBlank } from '@ember/utils';

import RSVP from 'rsvp';

export default class DashboardHomeRoute extends Route {
  @service current;
  @service store;
  @service session;

  async model() {
    const { user_id } = this.session.data.authenticated.userinfo;
    let user = null;
    let property = null;

    if (isBlank(this.current.user)) {
      user = await this.store.findRecord('user', user_id, {
        include: 'properties',
      });
      property = user.get('properties.firstObject');
    } else {
      property = this.current.user.get('properties.firstObject');
    }

    return RSVP.hash({
      user: this.current.user || user,
      property: this.current.propety || property,
      commonRequests: this.store.findAll('common-request', {
        backgroundReload: true,
      }),
      homeCareTips: this.store.findAll('home-care-tip', {
        backgroundReload: true,
      }),
    });
  }
}
