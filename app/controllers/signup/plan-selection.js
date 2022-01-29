import Controller from '@ember/controller';
// import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
import breadcrumbs from 'houseninja/utils/signup/breadcrumbs';

export default class SignupPlanSelectionController extends Controller {
  breadcrumbs = breadcrumbs.signUp;

  @service current;
  @service router;

  @action
  async selectPlan(planId) {
    let plan = this.model.findBy('id', planId);
    this.current.signup.selectedPlan = plan;

    this.router.transitionTo('signup.contact-info');
  }

  @action
  goBack() {
    this.router.transitionTo('signup.index');
  }
}
