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
      title: '2 months free service with House Ninja', //iOS - Displays in the email subject
      text: `Use my referral code ${this.promoCode} to get 2 months of free service with House Ninja!`, // iOS - Main content of email and text
      url: 'https://www.houseninja.co/', // iOS appended to main content (text property)
      dialogTitle: 'Share with buddies', //Android only. Not sure where it presents.
    });
  }
}
