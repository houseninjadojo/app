import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { DefaultRoute } from 'houseninja/data/enums/routes';
import OnboardingService from 'houseninja/services/onboarding';
import SessionService from 'houseninja/services/session';

export default class SignupRoute extends Route {
  @service declare session: SessionService;
  @service declare onboarding: OnboardingService;

  beforeModel(): void {
    // prohibit authorized users from returning to signup
    if (!this.session.isExternalSession) {
      this.session.prohibitAuthentication(DefaultRoute.SignedIn);
    }
    this.onboarding.rehydrate();
  }
}
