import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class SignupRoute extends Route {
  @service session;
  @service onboarding;

  beforeModel() {
    // prohibit authorized users from returning to signup
    this.session.prohibitAuthentication('dashboard.home');
    this.onboarding.rehydrate();
  }
}
