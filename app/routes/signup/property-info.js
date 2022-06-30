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

  beforeModel() {
    if (this.onboarding.currentStep === WALKTHROUGH_BOOKING) {
      this.router.transitionTo(SIGNUP_ROUTE.WALKTHROUGH_BOOKING);
    }
  }

  model() {
    return this.onboarding.fetchLocalModel('property');
  }

  activate() {
    this.onboarding.currentStep = PROPERTY_INFO;
  }

  deactivate() {
    this.onboarding.completeStep(PROPERTY_INFO);
  }
}
