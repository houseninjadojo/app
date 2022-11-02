import Service, { service } from '@ember/service';
import { Task, task } from 'ember-concurrency';
import { isEmpty, isPresent } from '@ember/utils';
import { nextStep as nextOnboardingStep } from 'houseninja/data/enums/onboarding-step';
import { captureException } from 'houseninja/utils/sentry';
import { pluralize } from 'ember-inflector';

import type StorageService from 'houseninja/services/storage';
import type MetricsService from 'houseninja/services/metrics';
import type StoreService from '@ember-data/store';

import type { OnboardingStep } from 'houseninja/data/enums/onboarding-step';
import type Model from '@ember-data/model';
import type User from 'houseninja/models/user';

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
  @service declare storage: StorageService;
  @service declare store: StoreService;
  @service declare metrics: MetricsService;

  currentStep: OnboardingStep | undefined;

  get nextStep(): OnboardingStep | undefined {
    return nextOnboardingStep(this.currentStep);
  }

  async completeStep(step: OnboardingStep): Promise<void> {
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

  sendTrackingEvent(step: OnboardingStep, user?: User) {
    try {
      this.metrics.trackEvent({
        event: step,
        properties: { user: user?.email },
      });
    } catch (e) {
      captureException(e as Error);
    }
  }

  cleanup(): void {
    this.storage.clearLocal();
    this.storage.setLocal('current-step', null);
  }

  routeFromStep(step: OnboardingStep): string {
    return `signup.${step}`;
  }

  async userFromOnboardingCode(onboardingCode: string): Promise<User> {
    return await this.store.queryRecord('user', {
      filter: { onboardingCode },
    });
  }

  rehydrateFromRemote: Task<void, []> = task(this, { drop: true }, async () => {
    const user = this.localModel('user');
    const includes = [
      'payment_methods',
      'promo_code',
      'properties',
      'properties.service_area',
      'subscription',
    ];
    await this.store.findRecord('user', user.id, {
      include: includes.join(','),
    });
    this.currentStep = user.onboardingStep;
  });

  async rehydrateFromCache(modelType = 'user'): Promise<void> {
    const cachedModel = await this.storage.getLocal(modelType);
    if (cachedModel) {
      try {
        this.store.pushPayload(cachedModel);
      } catch (e) {
        captureException(e as Error);
      }
    }
  }

  async rehydrate(): Promise<void> {
    CACHED_MODELS.forEach(async (modelName) => {
      const modelType = pluralize(modelName);
      await this.rehydrateFromCache(modelType);
    });
  }

  async dehydrate(): Promise<void> {
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

  // eslint-disable-next-line prettier/prettier
  async fetchLocalModel<M>(modelType: string): Promise<M extends Model ? M : undefined> {
    const model = this.localModel(modelType);
    if (isEmpty(model)) {
      await this.rehydrateFromCache(modelType);
    }
    return this.localModel(modelType);
  }

  localModel(modelType: string) {
    // im not sure why, but `this.store.peekFirst(modelType);` does not work
    // while this does.
    try {
      return this.store.peekAll(modelType).get('firstObject');
    } catch (e) {
      captureException(e as Error);
      return null;
    }
  }
}
