import Service, { service } from '@ember/service';
import { task } from 'ember-concurrency';
import { isEmpty, isPresent } from '@ember/utils';
import { nextStep as nextOnboardingStep } from 'houseninja/data/enums/onboarding-step';
import { captureException } from 'houseninja/utils/sentry';

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

  currentStep = null;
  _zipcode = null;

  get nextStep() {
    return nextOnboardingStep(this.currentStep);
  }

  async completeStep(step) {
    this.currentStep = step;
    await this.storage.setLocal('current-step', this.nextStep);
    const user = this.localModel('user');
    if (isPresent(user)) {
      user.onboardingStep = this.nextStep;
    }
    await this.dehydrate();
  }

  cleanup() {
    this.storage.clearLocal();
    this.storage.setLocal('current-step', null);
  }

  routeFromStep(step) {
    return `signup.${step}`;
  }

  async userFromOnboardingCode(code) {
    return await this.store.queryRecord('user', {
      filter: { code },
    });
  }

  @task({ drop: true }) *rehydrateFromRemote() {
    const user = this.localModel('user');
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
        captureException(e);
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

  get zipcode() {
    return this.storage.getLocal('zipcode').then((z) => z.toString());
  }

  set zipcode(zip) {
    this.storage.setLocal('zipcode', zip);
  }

  async fetchLocalModel(modelType) {
    const model = this.localModel(modelType);
    if (isEmpty(model)) {
      await this.rehydrateFromCache(modelType);
    }
    return this.localModel(modelType);
  }

  localModel(modelType) {
    return this.store.peekFirst(modelType);
  }
}
