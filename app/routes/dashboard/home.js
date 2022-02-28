import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { action } from '@ember/object';

import RSVP from 'rsvp';

export default class DashboardHomeRoute extends Route {
  @service current;
  @service store;

  model() {
    return RSVP.hash({
      commonRequests: this.store.findAll('common-request', {
        backgroundReload: true,
      }),
      homeCareTips: this.store.findAll('home-care-tip', {
        backgroundReload: true,
      }),
      user: this.current.user,
    });
  }

  @action
  loading() {
    return true;
  }
}
