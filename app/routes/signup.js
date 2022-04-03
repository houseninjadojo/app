import Route from '@ember/routing/route';
import { service } from '@ember/service';
import Sentry from 'houseninja/utils/sentry';
import { isPresent } from '@ember/utils';

export default class SignupRoute extends Route {
  @service session;
  @service store;
  @service router;

  queryParams = {
    onboardingCode: { refreshModel: false },
  };

  beforeModel() {
    // prohibit authorized users from returning to signup
    this.session.prohibitAuthentication('dashboard.home');
  }

  async model(params) {
    if (params.onboardingCode) {
      return await this.getUserFromOnboardingCode(params.onboardingCode);
    } else {
      this.router.transitionTo('signup.service-area');
    }
  }

  async afterModel(user) {
    if (isPresent(user) && user.isCurrentlyOnboarding()) {
      this.router.transitionTo(this.onboardingRoute(user.onboardingStep));
    } else {
      this.router.transitionTo('signup.service-area');
    }
  }

  async getUserFromOnboardingCode(onboardingCode) {
    let users = [];
    try {
      users = await this.store.queryAll('user', {
        filter: {
          onboardingCode: onboardingCode,
        },
      });
    } catch (e) {
      Sentry.captureException(e);
    }
    if (users.length == 1) {
      return users.get('firstObject');
    } else {
      return null;
    }
  }

  onboardingRoute(step) {
    return `signup.${step}`;
  }
}
