import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { NATIVE_MOBILE_ROUTE } from 'houseninja/data/enums/routes';

export default class SignupRoute extends Route {
  @service session;
  @service onboarding;

  beforeModel() {
    // prohibit authorized users from returning to signup
    if (this.session.data.authenticated.kind !== 'payment-approval') {
      this.session.prohibitAuthentication(NATIVE_MOBILE_ROUTE.DASHBOARD.HOME);
    }
    this.onboarding.rehydrate();
  }
}
