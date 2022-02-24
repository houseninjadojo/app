import Route from '@ember/routing/route';
import { service } from '@ember/service';
import RSVP from 'rsvp';

export default class SignupWalkthroughBookingRoute extends Route {
  @service store;

  async model() {
    return RSVP.hash({
      property: this.store.peekAll('property').get('firstObject'),
      serviceArea: this.store.peekAll('service-area').get('firstObject'),
      user: this.store.peekAll('user').get('firstObject'),
    });
  }
}
