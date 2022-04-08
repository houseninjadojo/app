import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { SIGNUP_ROUTE } from 'houseninja/data/enums/routes';

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

    this.router.transitionTo(SIGNUP_ROUTE.PAYMENT_METHOD);
  }

  @action
  goBack() {
    this.router.transitionTo(SIGNUP_ROUTE.CONTACT_INFO);
  }
}
