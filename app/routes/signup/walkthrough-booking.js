import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class SignupWalkthroughBookingRoute extends Route {
  @service store;

  async model() {
    // @todo
    // we are doing this while we only have 1 service area
    const serviceAreas = await this.store.query('service-area', {
      filter: {
        zipcodes: ['78702'],
      },
    });
    return serviceAreas.get('firstObject');
  }
}
