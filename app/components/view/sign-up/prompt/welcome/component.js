import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class WelcomeComponent extends Component {
  @service router;

  @action
  nextStep() {
    this.router.transitionTo('signup.property-info');
  }
}
