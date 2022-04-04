import Service, { service } from '@ember/service';
// import { get as unstash } from 'houseninja/utils/secure-storage';
// import { debug } from '@ember/debug';
import Sentry from 'houseninja/utils/sentry';
import { task } from 'ember-concurrency';
import { isEmpty, isPresent } from '@ember/utils';
import { nextStep as nextOnboardingStep } from 'houseninja/data/enums/onboarding-step';
import { debug } from '@ember/debug';

const CACHED_MODELS = [
  'payment-methods',
  'promo-codes',
  'properties',
  'service-areas',
  'subscriptions',
  'subscription-plans',
  'users',
];

export default class OnboardingService extends Service {
  @service storage;
  @service store;

  _currentStep = null;

  get nextStep() {
    return nextOnboardingStep(this._currentStep);
  }

  async completeStep(step) {
    console.log('completeStep', step);
    this._currentStep = step;
    await this.storage.setLocal('current-step', this.nextStep);
    const user = await this.localModel('user');
    if (isPresent(user)) {
      user.onboardingStep = this.nextStep;
    }
    await this.dehydrate();
  }

  cleanup() {
    this.storage.clearLocal();
  }

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

  // @task({ drop: true }) *rehydrateUser() {
  //   if (isEmpty(this.localUser())) {
  //     yield this.rehydrateFromCache.perform();
  //   }
  //   yield this.rehydrateFromRemote.perform();
  // }

  @task({ drop: true }) *rehydrateFromRemote() {
    const user = this.localUser();
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

  async rehydrateFromCache(modelType = 'user') {
    const cachedModel = await this.storage.getLocal(modelType);
    if (cachedModel) {
      try {
        this.store.pushPayload(cachedModel);
      } catch (e) {
        debug(e);
      }
    }
  }

  async rehydrate() {
    CACHED_MODELS.forEach(async (model) => {
      await this.rehydrateFromCache(model);
    });
  }

  async dehydrate() {
    const records = CACHED_MODELS.map((model) => {
      const record = this.localModel(model);
      if (isPresent(record)) {
        return record.serialize({ includeId: true });
      } else {
        return null;
      }
    }).compact();
    records.forEach(async (record) => {
      await this.storage.setLocal(record.data.type, record);
    });
  }

  async getZipcode() {
    const zip = await this.storage.getLocal('zipcode');
    return zip?.toString();
  }

  async setZipcode(zipcode) {
    await this.storage.setLocal('zipcode', zipcode);
  }

  async fetchLocalModel(modelType) {
    const model = this.localModel(modelType);
    if (isEmpty(model)) {
      await this.rehydrateFromCache(modelType);
    }
    return this.localModel(modelType);
  }

  localModel(modelType) {
    return this.store.peekAll(modelType).get('firstObject');
  }

  localUser() {
    return this.localModel('user');
  }
}
