import Route from '@ember/routing/route';
import { instrumentRoutePerformance } from '@sentry/ember';
import { service } from '@ember/service';
import { OnboardingStep } from 'houseninja/data/enums/onboarding-step';
import { SignupRoute } from 'houseninja/data/enums/routes';
import OnboardingService from 'houseninja/services/onboarding';
import RouterService from '@ember/routing/router-service';

class SignupBookingConfirmationRoute extends Route {
  @service declare onboarding: OnboardingService;
  @service declare router: RouterService;

  async beforeModel(): Promise<void> {
    const isSubscribed = await this.onboarding.isSubscribed();
    if (!isSubscribed) {
      this.router.transitionTo(SignupRoute.PaymentMethod);
    }
  }

  deactivate(): void {
    this.onboarding.completeStep(OnboardingStep.BookingConfirmation);
  }
}

export default instrumentRoutePerformance(SignupBookingConfirmationRoute);
