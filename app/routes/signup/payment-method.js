import Route from '@ember/routing/route';
import { service } from '@ember/service';
import * as Sentry from '@sentry/ember';
import { debug } from '@ember/debug';
import { task } from 'ember-concurrency';

export default class SignupPaymentMethodRoute extends Route {
  @service store;

  model() {
    this.generateSubscription.perform();
    return this.store.peekAll('credit-card').get('firstObject');
  }

  @task *generateSubscription() {
    let subscriptionPlans = this.store.peekAll('subscription-plan');
    if (subscriptionPlans.length === 0) {
      try {
        subscriptionPlans = yield this.store.findAll('subscription-plan');
      } catch (e) {
        debug(e);
        Sentry.captureException(e);
      }
    }
    let plan = subscriptionPlans.get('firstObject');
    this.store.createRecord('subscription', {
      subscriptionPlan: plan,
    });
  }
}
