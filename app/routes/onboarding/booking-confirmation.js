import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { BOOKING_CONFIRMATION } from 'houseninja/data/enums/onboarding-step';
import { SIGNUP_ROUTE } from 'houseninja/data/enums/routes';

export default class OnboardingBookingConfirmationRoute extends Route {
  @service onboarding;

  async beforeModel() {
    const isSubscribed = await this.onboarding.isSubscribed();
    if (!isSubscribed) {
      this.router.transitionTo(SIGNUP_ROUTE.PAYMENT_METHOD);
    }
  }

  deactivate() {
    this.onboarding.completeStep(BOOKING_CONFIRMATION);
  }
}
