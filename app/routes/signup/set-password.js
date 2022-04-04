import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { SET_PASSWORD } from 'houseninja/data/enums/onboarding-step';

export default class SignupSetPasswordRoute extends Route {
  @service store;
  @service onboarding;

  model() {
    return this.store.peekAll('user').get('firstObject');
  }

  deactivate() {
    this.onboarding.completeStep(SET_PASSWORD);
  }
}
