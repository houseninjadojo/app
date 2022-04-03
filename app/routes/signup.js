import Route from '@ember/routing/route';
import { service } from '@ember/service';
import Sentry from 'houseninja/utils/sentry';
import { isPresent } from '@ember/utils';
import { task } from 'ember-concurrency';

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
      this.router.transitionTo('signup.index');
    }
  }

  async afterModel(user) {
    if (isPresent(user) && user.isCurrentlyOnboarding) {
      // load what we need to rehydrate signup
      await this.rehydrateSignupStore.perform(user);
      this.router.transitionTo(this.onboardingRoute(user.onboardingStep));
    } else {
      this.router.transitionTo('signup.index');
    }
  }

  async getUserFromOnboardingCode(onboardingCode) {
    let users = [];
    try {
      users = await this.store.query('user', {
        filter: {
          onboardingCode: onboardingCode,
        },
      });
    } catch (e) {
      console.error(e);
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

  @task({ drop: true }) *rehydrateSignupStore(user) {
    const includes = [
      'payment_methods',
      'promo_code',
      'properties',
      'subscription',
    ];
    yield this.store.findRecord('user', user.id, {
      include: includes.join(','),
    });
  }
}
