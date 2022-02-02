import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
// import { debug } from '@ember/debug';
// import * as Sentry from '@sentry/ember';

export default class PlanSelectionComponent extends Component {
  @service current;
  @service router;
  // @service store;

  @action
  async selectPlan(planId) {
    let plan = this.args.plans.findBy('id', planId);
    this.current.signup.selectedPlan = plan;

    this.router.transitionTo('signup.contact-info');
  }

  @action
  goBack() {
    this.router.transitionTo('signup.index');
  }
}
