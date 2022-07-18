import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { Share } from '@capacitor/share';
import { debug } from '@ember/debug';
import * as Sentry from '@sentry/ember';

export default class ServiceAreaComponent extends Component {
  @service current;
  @service router;
  @service store;

  @tracked promoCode = this.current.user.get('promoCode.code');

  @action
  async handleClick() {
    try {
      await Share.share({
        title: 'Try House Ninja for two months FREE!', //iOS - Displays in the email subject
        text: `Hi! I wanted to share a service with you that I think you’ll love: House Ninja. If you join today and use my code ${this.promoCode} you’ll get your first two months free! www.houseninja.co/sign-up`, // iOS - Main content of email and text
        // url: '', // iOS appended to main content (text property), but doesn't work
        // dialogTitle: 'Share with buddies', //Android only. Not sure where it presents.
      });
    } catch (e) {
      debug(e);
      Sentry.captureException(e);
    }
  }
}
