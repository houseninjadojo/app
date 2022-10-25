import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { WALKTHROUGH_BOOKING } from 'houseninja/data/enums/onboarding-step';
import RSVP from 'rsvp';

export default class SignupWalkthroughBookingRoute extends Route {
  @service onboarding;

  async model() {
    const property = this.onboarding.localModel('property');
    let serviceArea = this.onboarding.localModel('service-area');
    if (!serviceArea) {
      serviceArea = await this.store.queryRecord('service-area', {
        filter: {
          zipcodes: [property.zipcode],
        },
      });
    }
    return RSVP.hash({
      property,
      serviceArea,
      user: this.onboarding.localModel('user'),
    });
  }

  deactivate() {
    this.onboarding.completeStep(WALKTHROUGH_BOOKING);
  }
}
