import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { WELCOME } from 'houseninja/data/enums/onboarding-step';

export default class SignupWelcomeRoute extends Route {
  @service onboarding;

  deactivate() {
    this.onboarding.completeStep(WELCOME);
  }
}
