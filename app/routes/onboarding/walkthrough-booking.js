import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { WALKTHROUGH_BOOKING } from 'houseninja/data/enums/onboarding-step';
import RSVP from 'rsvp';

export default class SignupWalkthroughBookingRoute extends Route {
  @service onboarding;

  model() {
    return RSVP.hash({
      property: this.onboarding.localModel('property'),
      serviceArea: this.onboarding.localModel('service-area'),
      user: this.onboarding.localModel('user'),
    });
  }

  deactivate() {
    this.onboarding.completeStep(WALKTHROUGH_BOOKING);
  }
}
