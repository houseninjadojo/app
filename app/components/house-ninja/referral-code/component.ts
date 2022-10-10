import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { Share } from '@capacitor/share';
import { captureException } from 'houseninja/utils/sentry';
import type RouterService from '@ember/routing/router-service';
import type StoreService from '@ember-data/store';
import type CurrentService from 'houseninja/services/current';

export default class ServiceAreaComponent extends Component {
  @service declare current: CurrentService;
  @service declare router: RouterService;
  @service declare store: StoreService;

  get promoCode(): string {
    // @ts-ignore
    return this.current.user.get('promoCode.code');
  }

  @action
  async handleClick() {
    // @ts-ignore
    const promoCode = this.current.user.get('promoCode.code');
    try {
      await Share.share({
        title: 'Try House Ninja for two months FREE!', //iOS - Displays in the email subject
        text: `Hi! I wanted to share a service with you that I think you’ll love: House Ninja. If you join today and use my code ${promoCode} you’ll get your first two months free! www.houseninja.co/sign-up`, // iOS - Main content of email and text
        // url: '', // iOS appended to main content (text property), but doesn't work
        // dialogTitle: 'Share with buddies', //Android only. Not sure where it presents.
      });
    } catch (e: any) {
      captureException(e);
    }
  }
}
