import Route from '@ember/routing/route';
import { instrumentRoutePerformance } from '@sentry/ember';
import { service } from '@ember/service';
import { OnboardingStep } from 'houseninja/data/enums/onboarding-step';
import OnboardingService from 'houseninja/services/onboarding';
import StoreService from 'houseninja/services/store';
import SubscriptionPlan from 'houseninja/models/subscription-plan';
import ArrayProxy from '@ember/array/proxy';

class SignupPlanSelectionRoute extends Route {
  @service declare store: StoreService;
  @service declare onboarding: OnboardingService;

  async model(): Promise<ArrayProxy<SubscriptionPlan> | undefined> {
    return await this.store.findAll('subscription-plan', {
      backgroundReload: true,
    });
  }

  deactivate(): void {
    this.onboarding.completeStep(OnboardingStep.PlanSelection);
  }
}

export default instrumentRoutePerformance(SignupPlanSelectionRoute);
