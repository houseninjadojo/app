import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { SignupRoute } from 'houseninja/data/enums/routes';
import CurrentService from 'houseninja/services/current';
import RouterService from '@ember/routing/router-service';
import StoreService from 'houseninja/services/store';
import SubscriptionPlan from 'houseninja/models/subscription-plan';

type Args = {
  plans: Array<SubscriptionPlan>;
};

export default class PlanSelectionComponent extends Component<Args> {
  @service declare current: CurrentService;
  @service declare router: RouterService;
  @service declare store: StoreService;

  @action
  async selectPlan(planId: string): Promise<void> {
    const plan = this.args.plans.findBy('id', planId);
    const subscription = this.store.createRecord('subscription', {
      subscriptionPlan: plan,
    });

    this.current.signup.subscription = subscription;

    this.router.transitionTo(SignupRoute.PaymentMethod);
  }

  @action
  goBack(): void {
    this.router.transitionTo(SignupRoute.ContactInfo);
  }
}
