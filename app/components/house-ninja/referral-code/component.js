import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { Share } from '@capacitor/share';

export default class ServiceAreaComponent extends Component {
  @service current;
  @service router;
  @service store;

  @tracked promoCode = this.current.user.get('promoCode.code');

  @action
  async handleClick() {
    await Share.share({
      title: 'Try House Ninja for two months FREE!', //iOS - Displays in the email subject
      text: `Hi! I wanted to share a service with you that I think you’ll love: House Ninja. If you join today and use my code ${this.promoCode} you’ll get your first two months free!`, // iOS - Main content of email and text
      url: 'http://www.houseninja.co/join', // iOS appended to main content (text property)
      // dialogTitle: 'Share with buddies', //Android only. Not sure where it presents.
    });
  }
}
