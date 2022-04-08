import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { NATIVE_MOBILE_ROUTE } from 'houseninja/data/enums/routes';

export default class HomeContentComponent extends Component {
  @service router;
  @service view;
  @service haptics;

  documentVaultRoute = NATIVE_MOBILE_ROUTE.VAULT.INDEX;

  get user() {
    return this.args.user;
  }

  get streetAddress() {
    const streetAddress =
      (this.args.property && this.args.property.get('streetAddress1')) || null;
    return streetAddress;
  }

  get salutation() {
    const myDate = new Date();
    const hrs = myDate.getHours();

    let greet;

    if (hrs < 12) greet = 'Good Morning';
    else if (hrs >= 12 && hrs <= 17) greet = 'Good Afternoon';
    else if (hrs >= 17 && hrs <= 24) greet = 'Good Evening';

    return `${greet}${this.user ? ', ' + this.user.firstName : ''}!`;
  }

  get prompt() {
    return `What can we help you with at ${!this.streetAddress ? 'home?' : ''}`;
  }

  get randomHomeCareTip() {
    let tipNumber = Math.floor(Math.random() * this.args.homeCareTips?.length);
    return this.args.homeCareTips?.objectAt(tipNumber);
  }
  @action
  async selectRoute(route) {
    this.haptics.giveFeedback();
    if (route === this.documentVaultRoute) {
      this.view.preservePreviousRoute(this.router);
    }
    this.router.transitionTo(route);
  }
}
