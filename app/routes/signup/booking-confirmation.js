import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { BOOKING_CONFIRMATION } from 'houseninja/data/enums/onboarding-step';

export default class SignupBookingConfirmationRoute extends Route {
  @service onboarding;

  activate() {
    this.onboarding.currentStep = BOOKING_CONFIRMATION;
  }

  deactivate() {
    this.onboarding.completeStep(BOOKING_CONFIRMATION);
  }
}
