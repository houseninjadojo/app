import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { isPresent } from '@ember/utils';
import { SERVICE_AREA } from 'houseninja/data/enums/onboarding-step';

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
      await this.rehydrateAndRedirect(user);
    }
    // actually return just the zipcode to `model`
    return this.onboarding.zipcode;
  }

  deactivate() {
    this.onboarding.completeStep(SERVICE_AREA);
  }

  async rehydrateAndRedirect(user) {
    if (isPresent(user) && user.isCurrentlyOnboarding) {
      // load what we need to rehydrate signup
      this.onboarding.rehydrateFromRemote.perform();
      // save progress locally
      await this.onboarding.dehydrate();
      // resume next step
      this.router.transitionTo(
        this.onboarding.routeFromStep(user.onboardingStep)
      );
    } else {
      this.router.transitionTo('signup.index');
    }
  }
}
