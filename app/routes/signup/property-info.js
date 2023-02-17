import Route from '@ember/routing/route';
import { service } from '@ember/service';
import {
  PROPERTY_INFO,
  WALKTHROUGH_BOOKING,
} from 'houseninja/data/enums/onboarding-step';
import { SIGNUP_ROUTE } from 'houseninja/data/enums/routes';

export default class SignupPropertyInfoRoute extends Route {
  @service onboarding;
  @service router;
  @service current;

  beforeModel() {
    if (this.onboarding.currentStep === WALKTHROUGH_BOOKING) {
      this.transitionTo(SIGNUP_ROUTE.WALKTHROUGH_BOOKING);
    }
    if (!this.current.user?.subscription) {
      this.router.transitionTo('signup.payment-method');
    }
  }

  model() {
    return this.onboarding.fetchLocalModel('property');
  }

  deactivate() {
    this.onboarding.completeStep(PROPERTY_INFO);
  }
}
