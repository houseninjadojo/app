import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { OnboardingStep } from 'houseninja/data/enums/onboarding-step';
import RSVP from 'rsvp';

import type OnboardingService from 'houseninja/services/onboarding';
import type Property from 'houseninja/models/property';
import type ServiceArea from 'houseninja/models/service-area';
import type User from 'houseninja/models/user';

type ModelResponse = {
  property?: Property;
  serviceArea?: ServiceArea;
  user?: User;
};

export default class SignupWalkthroughBookingRoute extends Route {
  @service declare onboarding: OnboardingService;
  @service declare current: any;
  @service declare router: any;

  async model(): Promise<ModelResponse> {
    return RSVP.hash({
      property: await this.onboarding.fetchLocalModel('property'),
      serviceArea: await this.onboarding.fetchLocalModel('service-area'),
      user: await this.onboarding.fetchLocalModel('user'),
    });
  }

  deactivate(): void {
    this.onboarding.completeStep(OnboardingStep.WalkthroughBooking);
  }

  beforeModel() {
    if (!this.current.user?.subscription) {
      this.router.transitionTo('signup.payment-method');
    }
  }
}
