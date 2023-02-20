import Route from '@ember/routing/route';
import { service } from '@ember/service';
import {
  PROPERTY_INFO,
  WALKTHROUGH_BOOKING,
} from 'houseninja/data/enums/onboarding-step';
import { SIGNUP_ROUTE } from 'houseninja/data/enums/routes';

export default class OnboardingPropertyInfoRoute extends Route {
  @service onboarding;
  @service router;

  async beforeModel() {
    const isSubscribed = await this.onboarding.isSubscribed();
    if (!isSubscribed) {
      this.router.transitionTo(SIGNUP_ROUTE.PAYMENT_METHOD);
    }
    if (this.onboarding.currentStep === WALKTHROUGH_BOOKING) {
      this.router.transitionTo(SIGNUP_ROUTE.WALKTHROUGH_BOOKING);
    }
  }

  model() {
    return this.onboarding.fetchLocalModel('property');
  }

  deactivate() {
    this.onboarding.completeStep(PROPERTY_INFO);
  }
}
