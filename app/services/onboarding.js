import Service, { service } from '@ember/service';
// import { get as unstash } from 'houseninja/utils/secure-storage';
// import { debug } from '@ember/debug';
import Sentry from 'houseninja/utils/sentry';
import { task } from 'ember-concurrency';
import { isEmpty, isPresent } from '@ember/utils';

const CACHED_MODELS = [
  'payment-method',
  'promo-code',
  'properties',
  'service-area',
  'subscription',
  'subscription-plan',
  'user',
];

export default class OnboardingService extends Service {
  @service storage;
  @service store;

  _currentStep = null;

  completeStep(step) {
    this._currentStep = step;
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
      console.error(e);
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
      this.store.pushPayload(cachedModel);
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
      await this.storage.setLocal(record.type, record);
    });
  }

  async getZipcode() {
    return await this.storage.getLocal('zipcode');
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
