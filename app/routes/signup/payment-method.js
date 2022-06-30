import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { captureException } from 'houseninja/utils/sentry';
import { task } from 'ember-concurrency';
import { PAYMENT_METHOD } from 'houseninja/data/enums/onboarding-step';

export default class SignupPaymentMethodRoute extends Route {
  @service store;
  @service onboarding;

  activate() {
    this.onboarding.currentStep = PAYMENT_METHOD;
  }

  async model() {
    this.fetchSubscriptionPlan.perform();
    return this.onboarding.fetchLocalModel('credit-card');
  }

  deactivate() {
    this.onboarding.completeStep(PAYMENT_METHOD);
  }

  @task({ drop: true }) *fetchSubscriptionPlan() {
    // while we are only using the monthly plan, we can
    // simply reload the subscription plan instance from the API
    this.store.unloadAll('subscription-plan');
    try {
      return yield this.store.findFirst('subscription-plan');
    } catch (e) {
      captureException(e);
    }
  }
}
