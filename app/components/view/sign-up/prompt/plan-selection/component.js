import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
// import { debug } from '@ember/debug';
// import * as Sentry from '@sentry/ember';

export default class PlanSelectionComponent extends Component {
  @service current;
  @service router;
  @service store;

  @action
  async selectPlan(planId) {
    let plan = this.args.plans.findBy('id', planId);
    let subscription = this.store.createRecord('subscription', {
      subscriptionPlan: plan,
    });

    this.current.signup.subscription = subscription;

    this.router.transitionTo('signup.payment-method');
  }

  @action
  goBack() {
    this.router.transitionTo('signup.contact-info');
  }
}
