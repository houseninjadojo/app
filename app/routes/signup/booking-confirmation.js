import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { BOOKING_CONFIRMATION } from 'houseninja/data/enums/onboarding-step';

export default class SignupBookingConfirmationRoute extends Route {
  @service onboarding;
  @service router;
  @service current;

  deactivate() {
    this.onboarding.completeStep(BOOKING_CONFIRMATION);
  }

  beforeModel() {
    if (!this.current.user?.subscription) {
      this.router.transitionTo('signup.payment-method');
    }
  }
}
