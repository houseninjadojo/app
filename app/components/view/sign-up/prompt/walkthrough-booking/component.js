import Component from '@glimmer/component';
// import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
// import { service } from '@ember/service';
// import { debug } from '@ember/debug';
// import * as Sentry from '@sentry/ember';

export default class WalkthroughBookingComponent extends Component {
  // @service current;
  // @service router;
  // @service store;

  @action
  async saveWalkthroughBooking() {
    this.router.transitionTo('signup.booking-confirmation');
  }

  @action
  goBack() {
    this.router.transitionTo('signup.welcome');
  }
}
