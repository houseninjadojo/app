import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { captureException } from 'houseninja/utils/sentry';
import { task } from 'ember-concurrency';
import { PAYMENT_METHOD } from 'houseninja/data/enums/onboarding-step';
import { isEmpty } from '@ember/utils';

export default class SignupPaymentMethodRoute extends Route {
  @service store;
  @service onboarding;

  async model() {
    this.generateSubscription.perform();
    // this.rehydrateOrGenerateSubscription.perform();
    return this.onboarding.fetchLocalModel('credit-card');
  }

  deactivate() {
    this.onboarding.completeStep(PAYMENT_METHOD);
  }

  @task *generateSubscription() {
    const subscriptionPlan = yield this.fetchSubscriptionPlan.perform();
    this.store.createRecord('subscription', {
      subscriptionPlan,
    });
  }

  @task({ drop: true }) *rehydrateOrGenerateSubscription() {
    if (isEmpty(this.store.peekFirst('subscription')?.id)) {
      yield this.generateSubscription.perform();
    }
  }

  @task({ drop: true }) *fetchSubscriptionPlan() {
    let subscriptionPlan = this.onboarding.fetchLocalModel('subscription-plan');
    if (isEmpty(subscriptionPlan)) {
      try {
        subscriptionPlan = yield this.store.findFirst('subscription-plan');
      } catch (e) {
        captureException(e);
      }
    }
    return subscriptionPlan;
  }
}
