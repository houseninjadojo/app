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
    this.rehydrateOrGenerateSubscription.perform();
    return this.onboarding.fetchLocalModel('credit-card');
  }

  deactivate() {
    this.onboarding.completeStep(PAYMENT_METHOD);
  }

  @task *generateSubscription() {
    let subscriptionPlan = this.onboarding.fetchLocalModel('subscription-plan');
    if (isEmpty(subscriptionPlan)) {
      try {
        subscriptionPlan = yield this.store.findFirst('subscription-plan');
      } catch (e) {
        captureException(e);
      }
    }
    this.store.createRecord('subscription', {
      subscriptionPlan,
    });
  }

  @task({ drop: true }) *rehydrateOrGenerateSubscription() {
    if (this.store.peekAll('subscription').get('length') === 0) {
      yield this.generateSubscription.perform();
    }
  }
}
