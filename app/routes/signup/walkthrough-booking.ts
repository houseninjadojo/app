import Route from '@ember/routing/route';
import { instrumentRoutePerformance } from '@sentry/ember';
import { service } from '@ember/service';
import { OnboardingStep } from 'houseninja/data/enums/onboarding-step';
import { SignupRoute } from 'houseninja/data/enums/routes';
import RSVP from 'rsvp';

import type OnboardingService from 'houseninja/services/onboarding';
import type Property from 'houseninja/models/property';
import type ServiceArea from 'houseninja/models/service-area';
import type User from 'houseninja/models/user';
import CurrentService from 'houseninja/services/current';
import RouterService from '@ember/routing/router-service';

type ModelResponse = {
  property?: Property;
  serviceArea?: ServiceArea;
  user?: User;
};

class SignupWalkthroughBookingRoute extends Route {
  @service declare onboarding: OnboardingService;
  @service declare current: CurrentService;
  @service declare router: RouterService;

  async beforeModel(): Promise<void> {
    const isSubscribed = await this.onboarding.isSubscribed();
    if (!isSubscribed) {
      this.router.transitionTo(SignupRoute.PaymentMethod);
    }
    if (this.onboarding.currentStep === OnboardingStep.WalkthroughBooking) {
      this.router.transitionTo(SignupRoute.WalkthroughBooking);
    }
  }

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
}

export default instrumentRoutePerformance(SignupWalkthroughBookingRoute);
