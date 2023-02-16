import Route from '@ember/routing/route';
import { instrumentRoutePerformance } from '@sentry/ember';
import { service } from '@ember/service';
import { OnboardingStep } from 'houseninja/data/enums/onboarding-step';
import StoreService from 'houseninja/services/store';
import OnboardingService from 'houseninja/services/onboarding';
import User from 'houseninja/models/user';

class SignupContactInfoRoute extends Route {
  @service declare store: StoreService;
  @service declare onboarding: OnboardingService;

  async model(): Promise<User> {
    return await this.onboarding.fetchLocalModel('user');
  }

  deactivate(): void {
    this.onboarding.completeStep(OnboardingStep.ContactInfo);
  }
}

export default instrumentRoutePerformance(SignupContactInfoRoute);
