import Route from '@ember/routing/route';
import { instrumentRoutePerformance } from '@sentry/ember';
import { service } from '@ember/service';
import { OnboardingStep } from 'houseninja/data/enums/onboarding-step';
import { SignupRoute } from 'houseninja/data/enums/routes';
import OnboardingService from 'houseninja/services/onboarding';
import RouterService from '@ember/routing/router-service';
import Property from 'houseninja/models/property';

class SignupPropertyInfoRoute extends Route {
  @service declare onboarding: OnboardingService;
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

  model(): Promise<Property> {
    return this.onboarding.fetchLocalModel('property');
  }

  deactivate(): void {
    this.onboarding.completeStep(OnboardingStep.PropertyInfo);
  }
}

export default instrumentRoutePerformance(SignupPropertyInfoRoute);
