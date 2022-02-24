import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class SignupWalkthroughBookingRoute extends Route {
  @service store;

  async model() {
    // @todo
    // we are doing this while we only have 1 service area
    return this.store.findAll('service-area').get('firstObject');
  }
}
