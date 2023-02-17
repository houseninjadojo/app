import Route from '@ember/routing/route';
import { instrumentRoutePerformance } from '@sentry/ember';
import { service } from '@ember/service';
import { isPresent } from '@ember/utils';
import { OnboardingStep } from 'houseninja/data/enums/onboarding-step';
import { next } from '@ember/runloop';
import { SignupRoute } from 'houseninja/data/enums/routes';
import OnboardingService from 'houseninja/services/onboarding';
import RouterService from '@ember/routing/router-service';
import StoreService from 'houseninja/services/store';
import User from 'houseninja/models/user';

type QueryParams = {
  onboardingCode?: string;
};

class SignupIndexRoute extends Route {
  @service declare router: RouterService;
  @service declare onboarding: OnboardingService;
  @service declare store: StoreService;

  queryParams = {
    onboardingCode: { refreshModel: false },
  };

  async model(params: QueryParams): Promise<string | undefined> {
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

  deactivate(): void {
    this.onboarding.completeStep(OnboardingStep.ServiceArea);
  }

  async rehydrateAndRedirect(user: User): Promise<void> {
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
      this.router.transitionTo(SignupRoute.Index);
    }
  }
}

export default instrumentRoutePerformance(SignupIndexRoute);
