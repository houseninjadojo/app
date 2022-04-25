import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { BOOKING_CONFIRMATION } from 'houseninja/data/enums/onboarding-step';

export default class OnboardingBookingConfirmationRoute extends Route {
  @service onboarding;

  deactivate() {
    this.onboarding.completeStep(BOOKING_CONFIRMATION);
  }
}
