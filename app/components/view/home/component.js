import Component from '@glimmer/component';
import { service } from '@ember/service';

export default class HomeContentComponent extends Component {
  @service current;

  get user() {
    return this.current.user;
  }

  get streetAddress() {
    const streetAddress = this.current.property.get('address.street1') || null;
    return streetAddress || 'home';
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
    return `What can we help you with at ${this.streetAddress}?`;
  }

  get randomHomeCareTip() {
    let tipNumber = Math.floor(Math.random() * this.args.homeCareTips.length);
    return this.args.homeCareTips.objectAt(tipNumber);
  }
}
