import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { PROPERTY_INFO } from 'houseninja/data/enums/onboarding-step';

export default class SignupPropertyInfoRoute extends Route {
  @service onboarding;

  model() {
    return this.onboarding.fetchLocalModel('property');
  }

  deactivate() {
    this.onboarding.completeStep(PROPERTY_INFO);
  }
}
