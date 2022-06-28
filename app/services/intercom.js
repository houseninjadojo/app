import Service from '@ember/service';
import { service } from '@ember/service';
import { Intercom } from '@capacitor-community/intercom';
import isNativePlatform from 'houseninja/utils/is-native-platform';
import ENV from 'houseninja/config/environment';
import { task } from 'ember-concurrency';

export default class IntercomService extends Service {
  @service current;
  @service analytics;

  unreadConversationCount = '';
  isOpen = false;

  async setup() {
    // hide launcher on mobile devices
    if (isNativePlatform()) {
      await Intercom.hideInAppMessages();
      await Intercom.hideLauncher();
    }
  }

  async registerUser(userId, email, hmac) {
    if (isNativePlatform()) {
      await Intercom.registerIdentifiedUser({
        userId,
        email,
      });
      await Intercom.setUserHash({ hmac });
    } else {
      await Intercom.boot({
        appId: ENV.intercom.appId,
        userId,
        email,
        userHash: hmac,
      });
    }
  }

  async setupListeners() {
    await Intercom.addListener('onUnreadCountChange', ({ value }) => {
      this.unreadConversationCount = value;
    });
  }

  showMessenger() {
    this._showMessenger.perform();
  }

  @task({ drop: true }) *_showMessenger() {
    this.isOpen = true;
    this.analytics.track('Intercom messenger opened', {});
    yield Intercom.displayMessenger();
  }

  showComposer(message) {
    this._showComposer.perform(message);
  }

  @task({ drop: true }) *_showComposer(message = '') {
    this.isOpen = true;
    this.analytics.track('Intercom composer opened', {
      message,
    });
    yield Intercom.displayMessageComposer({ message });
  }

  hide() {
    this._hide.perform();
  }

  @task({ drop: true }) *_hide() {
    this.isOpen = false;
    yield Intercom.hideMessenger();
  }

  logout() {
    if (this.isOpen) {
      this._hide.perform();
    }
    Intercom.logout();
  }
}
