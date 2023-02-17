import Route from '@ember/routing/route';
import { instrumentRoutePerformance } from '@sentry/ember';
import { service } from '@ember/service';
import { OnboardingStep } from 'houseninja/data/enums/onboarding-step';
import OnboardingService from 'houseninja/services/onboarding';

class SignupBookingConfirmationRoute extends Route {
  @service declare onboarding: OnboardingService;

  deactivate(): void {
    this.onboarding.completeStep(OnboardingStep.BookingConfirmation);
  }
}

export default instrumentRoutePerformance(SignupBookingConfirmationRoute);
