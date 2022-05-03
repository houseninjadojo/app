import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { WALKTHROUGH_BOOKING } from 'houseninja/data/enums/onboarding-step';
import RSVP from 'rsvp';
import { isBlank } from '@ember/utils';

export default class OnboardingWalkthroughBookingRoute extends Route {
  @service current;
  @service onboarding;
  @service store;

  async model() {
    if (isBlank(this.current.property)) {
      await this.current.loadUser();
    }
    const serviceArea = await this.store.queryRecord('service-area', {
      filter: {
        zipcodes: [this.current.property.zipcode],
      },
    });

    return RSVP.hash({
      user: this.current.user,
      property: this.current.property,
      serviceArea,
    });
  }

  deactivate() {
    this.onboarding.completeStep(WALKTHROUGH_BOOKING);
  }
}
