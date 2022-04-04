import Route from '@ember/routing/route';
import { service } from '@ember/service';
// import { isPresent } from '@ember/utils';

export default class SignupRoute extends Route {
  @service session;
  // @service store;
  // @service router;
  @service onboarding;

  // queryParams = {
  //   onboardingCode: { refreshModel: false },
  // };

  beforeModel() {
    // prohibit authorized users from returning to signup
    this.session.prohibitAuthentication('dashboard.home');
    this.onboarding.rehydrate();
  }

  // async model(params) {
  //   if (params.onboardingCode) {
  //     return await this.onboarding.userFromOnboardingCode(
  //       params.onboardingCode
  //     );
  //   } else {
  //     this.router.transitionTo('signup.index');
  //   }
  // }

  // afterModel(user) {
  //   if (isPresent(user) && user.isCurrentlyOnboarding) {
  //     // load what we need to rehydrate signup
  //     this.onboarding.rehydrateUser.perform();
  //     console.log(user.serialize());
  //     this.router.transitionTo(
  //       this.onboarding.routeFromStep(user.onboardingStep)
  //     );
  //   } else {
  //     this.router.transitionTo('signup.index');
  //   }
  // }
}
