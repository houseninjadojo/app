import Service, { service } from '@ember/service';
// import { get as unstash } from 'houseninja/utils/secure-storage';
// import { debug } from '@ember/debug';
import Sentry from 'houseninja/utils/sentry';
import { task } from 'ember-concurrency';

export default class OnboardingService extends Service {
  @service store;

  routeFromStep(step) {
    return `signup.${step}`;
  }

  async userFromOnboardingCode(onboardingCode) {
    return await this.fetchUserFromOnboardingCode.perform(onboardingCode);
  }

  @task({ drop: true }) *fetchUserFromOnboardingCode(onboardingCode) {
    let users = [];
    try {
      users = yield this.store.query('user', {
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

  @task({ drop: true }) *rehydrateUser(user) {
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
