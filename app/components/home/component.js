import Component from '@glimmer/component';
@service current;

export default class HomeContentComponent extends Component {
  get user() {
    return this.current.user;
  }

  get property() {
    return this.current.property;
  }

  get getSalutation() {
    const myDate = new Date();
    const hrs = myDate.getHours();

    let greet;

    if (hrs < 12)
      greet = 'Good Morning';
    else if (hrs >= 12 && hrs <= 17)
      greet = 'Good Afternoon';
    else if (hrs >= 17 && hrs <= 24)
      greet = 'Good Evening';

    return `${greet}, ${this.user.firstName}!`;
  }

  get getPrompt() {
    return `What can we help you with at ${this.property.line1}?`;
  }
}
