import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { PLAN_SELECTION } from 'houseninja/data/enums/onboarding-step';

export default class SignupPlanSelectionRoute extends Route {
  @service store;
  @service onboarding;

  async model() {
    return await this.store.findAll('subscription-plan', {
      backgroundReload: true,
    });
  }

  activate() {
    this.onboarding.currentStep = PLAN_SELECTION;
  }

  deactivate() {
    this.onboarding.completeStep(PLAN_SELECTION);
  }
}
