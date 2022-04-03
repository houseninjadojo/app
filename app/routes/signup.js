import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { isPresent } from '@ember/utils';

export default class SignupRoute extends Route {
  @service session;
  @service store;
  @service router;
  @service onboarding;

  queryParams = {
    onboardingCode: { refreshModel: false },
  };

  beforeModel() {
    // prohibit authorized users from returning to signup
    this.session.prohibitAuthentication('dashboard.home');
  }

  async model(params) {
    if (params.onboardingCode) {
      return await this.onboarding.userFromOnboardingCode(
        params.onboardingCode
      );
    } else {
      this.router.transitionTo('signup.index');
    }
  }

  async afterModel(user) {
    if (isPresent(user) && user.isCurrentlyOnboarding) {
      // load what we need to rehydrate signup
      await this.onboarding.rehydrateUser.perform(user);
      this.router.transitionTo(
        this.onboarding.routeFromStep(user.onboardingStep)
      );
    } else {
      this.router.transitionTo('signup.index');
    }
  }
}
