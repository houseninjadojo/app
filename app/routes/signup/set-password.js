import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { SET_PASSWORD } from 'houseninja/data/enums/onboarding-step';

export default class SignupSetPasswordRoute extends Route {
  @service store;
  @service onboarding;
  @service router;

  async model() {
    return await this.onboarding.fetchLocalModel('user');
  }

  deactivate() {
    this.onboarding.completeStep(SET_PASSWORD);
  }

  beforeModel() {
    if (!this.current.user?.subscription) {
      this.router.transitionTo('signup.payment-method');
    }
  }
}
