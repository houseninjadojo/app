import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { CONTACT_INFO } from 'houseninja/data/enums/onboarding-step';

export default class SignupContactInfoRoute extends Route {
  @service store;
  @service onboarding;

  async model() {
    return await this.onboarding.fetchLocalModel('user');
  }

  deactivate() {
    this.onboarding.completeStep(CONTACT_INFO);
  }
}
