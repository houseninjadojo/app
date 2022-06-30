import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { SET_PASSWORD } from 'houseninja/data/enums/onboarding-step';

export default class SignupSetPasswordRoute extends Route {
  @service store;
  @service onboarding;

  async model() {
    return await this.onboarding.fetchLocalModel('user');
  }

  activate() {
    this.onboarding.currentStep = SET_PASSWORD;
  }

  deactivate() {
    this.onboarding.completeStep(SET_PASSWORD);
  }
}
