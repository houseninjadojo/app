import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';
import breadcrumbs from 'houseninja/utils/signup/breadcrumbs';

export default class SignupWelcomeController extends Controller {
  breadcrumbs = breadcrumbs.walkthrough;

  @service router;

  @action
  nextStep() {
    this.router.transitionTo('signup.property-info');
  }
}
