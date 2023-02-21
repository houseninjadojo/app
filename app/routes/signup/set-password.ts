import Route from '@ember/routing/route';
import { instrumentRoutePerformance } from '@sentry/ember';
import { service } from '@ember/service';
import { OnboardingStep } from 'houseninja/data/enums/onboarding-step';
import StoreService from 'houseninja/services/store';
import OnboardingService from 'houseninja/services/onboarding';
import User from 'houseninja/models/user';
import RouterService from '@ember/routing/router-service';
import { SignupRoute } from 'houseninja/data/enums/routes';

class SignupSetPasswordRoute extends Route {
  @service declare onboarding: OnboardingService;
  @service declare router: RouterService;
  @service declare store: StoreService;

  beforeModel(): void {
    if (!this.onboarding.isSubscribed) {
      this.router.transitionTo(SignupRoute.PaymentMethod);
    }
  }

  async model(): Promise<User | undefined> {
    return await this.onboarding.fetchLocalModel('user');
  }

  deactivate(): void {
    this.onboarding.completeStep(OnboardingStep.SetPassword);
  }
}

export default instrumentRoutePerformance(SignupSetPasswordRoute);
