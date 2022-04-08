import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { isPresent } from '@ember/utils';
import { SERVICE_AREA } from 'houseninja/data/enums/onboarding-step';
import { next } from '@ember/runloop';
import { SIGNUP_ROUTE } from 'houseninja/data/enums/routes';

export default class SignupIndexRoute extends Route {
  @service router;
  @service onboarding;
  @service store;

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
    if (isPresent(user) && user.shouldResumeOnboarding) {
      // load what we need to rehydrate signup
      await this.onboarding.rehydrateFromRemote.perform();
      // save progress locally
      next(this.onboarding, 'dehydrate');
      // resume next step
      this.router.transitionTo(
        this.onboarding.routeFromStep(user.onboardingStep)
      );
    } else {
      this.router.transitionTo(SIGNUP_ROUTE.INDEX);
    }
  }
}
