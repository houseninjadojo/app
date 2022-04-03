import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { isPresent } from '@ember/utils';

export default class SignupIndexRoute extends Route {
  @service router;
  @service onboarding;

  queryParams = {
    onboardingCode: { refreshModel: false },
  };

  async model(params) {
    // deal with an onboarding code passed into query params
    if (params.onboardingCode) {
      const user = await this.onboarding.userFromOnboardingCode(
        params.onboardingCode
      );
      this.rehydrateAndRedirect(user);
    }

    // actually return just the zipcode to `model`
    return await this.onboarding.getZipcode();
  }

  rehydrateAndRedirect(user) {
    if (isPresent(user) && user.isCurrentlyOnboarding) {
      // load what we need to rehydrate signup
      this.onboarding.rehydrateUser.perform();
      this.router.transitionTo(
        this.onboarding.routeFromStep(user.onboardingStep),
        { queryParams: null }
      );
    } else {
      this.router.transitionTo('signup.index', { queryParams: null });
    }
  }
}
