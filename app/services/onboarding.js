import Service, { service } from '@ember/service';
import { task } from 'ember-concurrency';
import { isEmpty, isPresent } from '@ember/utils';
import { nextStep as nextOnboardingStep } from 'houseninja/data/enums/onboarding-step';
import { captureException } from 'houseninja/utils/sentry';
import { pluralize } from 'ember-inflector';

const CACHED_MODELS = [
  'payment-method',
  'promo-code',
  'property',
  'service-area',
  'subscription',
  'subscription-plan',
  'user',
];

const TTL_MINUTES = 30;

export default class OnboardingService extends Service {
  @service storage;
  @service store;
  @service metrics;

  currentStep = null;

  get nextStep() {
    return nextOnboardingStep(this.currentStep);
  }

  async completeStep(step) {
    this.currentStep = step;
    await this.storage.setLocal('current-step', this.nextStep, TTL_MINUTES);
    const user = this.localModel('user');
    if (isPresent(user)) {
      user.onboardingStep = this.nextStep;
      user.save();
    }
    await this.dehydrate();
    this.sendTrackingEvent(step, user);
  }

  sendTrackingEvent(step, user) {
    this.metrics.trackEvent({ event: step, properties: { user: user?.email } });
  }

  cleanup() {
    this.storage.clearLocal();
    this.storage.setLocal('current-step', null);
  }

  routeFromStep(step) {
    return `signup.${step}`;
  }

  async userFromOnboardingCode(onboardingCode) {
    return await this.store.queryRecord('user', {
      filter: { onboardingCode },
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
    this.currentStep = user.onboardingStep;
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
    CACHED_MODELS.forEach(async (modelName) => {
      const modelType = pluralize(modelName);
      await this.rehydrateFromCache(modelType);
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
      await this.storage.setLocal(record.data.type, record, TTL_MINUTES);
    });
  }

  get zipcode() {
    return this.storage.getLocal('zipcode').then((z) => z?.toString());
  }

  set zipcode(zip) {
    this.storage.setLocal('zipcode', zip, TTL_MINUTES);
  }

  async fetchLocalModel(modelType) {
    const model = this.localModel(modelType);
    if (isEmpty(model)) {
      await this.rehydrateFromCache(modelType);
    }
    return this.localModel(modelType);
  }

  localModel(modelType) {
    // im not sure why, but `this.store.peekFirst(modelType);` does not work
    // while this does.
    return this.store.peekAll(modelType).get('firstObject');
  }
}
