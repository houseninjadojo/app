import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class HomeContentComponent extends Component {
  @service current;

  get getUser() {
    return this.current.user;
  }

  get getProperty() {
    let streetAddress = '';
    const hasAStreetAddress =
      this.current.property &&
      this.current.property.content &&
      this.current.property.content.line1;

    if (hasAStreetAddress) {
      streetAddress =
        this.current.property &&
        this.current.property.content &&
        this.current.property.content.line1;
    }

    return streetAddress || 'home';
  }

  get getSalutation() {
    const myDate = new Date();
    const hrs = myDate.getHours();

    let greet;

    if (hrs < 12) greet = 'Good Morning';
    else if (hrs >= 12 && hrs <= 17) greet = 'Good Afternoon';
    else if (hrs >= 17 && hrs <= 24) greet = 'Good Evening';

    return `${greet}${this.getUser ? ', ' + this.getUser.firstName : ''}!`;
  }

  get getPrompt() {
    return `What can we help you with at ${this.getProperty}?`;
  }
}
