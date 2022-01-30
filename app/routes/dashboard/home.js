import Route from '@ember/routing/route';
import { service } from '@ember/service';
import RSVP from 'rsvp';

export default class DashboardHomeRoute extends Route {
  @service current;
  @service store;

  model() {
    return RSVP.hash({
      commonRequests: this.store.findAll('common-request'),
      homeCareTips: this.store.findAll('home-care-tip'),
      user: this.current.user,
    });
  }
}
