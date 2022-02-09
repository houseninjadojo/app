import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class SignupWalkthroughBookingRoute extends Route {
  @service store;

  async model() {
    return this.store.peekAll('service-area').get('firstObject');
  }
}
