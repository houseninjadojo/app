import Service from '@ember/service';
import { service } from '@ember/service';
import { Intercom } from '@capacitor-community/intercom';
import isNativePlatform from 'houseninja/utils/is-native-platform';
import ENV from 'houseninja/config/environment';
import { task, type Task } from 'ember-concurrency';
import Sentry, { captureException, startSpan } from 'houseninja/utils/sentry';

export default class IntercomService extends Service {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @service declare current: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @service declare analytics: any;

  unreadConversationCount = '';
  isOpen = false;

  async setup(): Promise<void> {
    Sentry.addBreadcrumb({
      category: 'intercom.setup',
      message: 'setting up',
    });
    // hide launcher on mobile devices
    if (isNativePlatform()) {
      await Intercom.hideInAppMessages();
      await Intercom.hideLauncher();
    }
  }

  // eslint-disable-next-line
  async registerUser(userId: string, email: string, hmac: string): Promise<void> {
    startSpan({ op: 'intercom.user.register' })?.finish();
    Sentry.addBreadcrumb({
      category: 'intercom.login',
      message: 'attaching user',
      data: {
        user: { id: userId, email },
      },
    });
    if (isNativePlatform()) {
      await Intercom.setUserHash({ hmac });
      await Intercom.loginUser({
        userId,
        email,
      });
    } else {
      await Intercom.boot({
        app_id: ENV.intercom.appId,
        user_id: userId,
        email,
        user_hash: hmac,
      });
    }
  }

  async setupListeners(): Promise<void> {
    await Intercom.addListener('onUnreadCountChange', ({ value }) => {
      this.unreadConversationCount = value ?? '';
    });
  }

  showMessenger(): void {
    this._showMessenger.perform();
  }

  _showMessenger: Task<void, []> = task(this, { drop: true }, async () => {
    startSpan({ op: 'intercom.show.messenger' })?.finish();
    Sentry.addBreadcrumb({
      category: 'intercom.show',
      message: 'showing messenger',
    });
    this.isOpen = true;
    this.analytics.track('Intercom messenger opened', {});
    await Intercom.displayMessenger();
  });

  showComposer(message: string): void {
    this._showComposer.perform(message);
  }

  // prettier-ignore
  _showComposer: Task<void, [key: string]> = task(this, { drop: true }, async (message = '') => {
    startSpan({ op: 'intercom.show.composer' })?.finish();
    Sentry.addBreadcrumb({
      category: 'intercom.show',
      message: 'showing composer',
      data: { message },
    });
    this.isOpen = true;
    this.analytics.track('Intercom composer opened', {
      message,
    });
    try {
      await Intercom.displayMessageComposer({ message });
    } catch (e: unknown) {
      captureException(e as Error);
    }
  });

  hide(): void {
    this._hide.perform();
  }

  _hide: Task<void, []> = task(this, { drop: true }, async () => {
    startSpan({ op: 'intercom.hide' })?.finish();
    Sentry.addBreadcrumb({
      category: 'intercom.hide',
      message: 'hiding messenger',
    });
    this.isOpen = false;
    await Intercom.hideMessenger();
  });

  logout(): void {
    startSpan({ op: 'intercom.user.logout' })?.finish();
    Sentry.addBreadcrumb({
      category: 'intercom.logout',
      message: 'logging out',
    });
    if (this.isOpen) {
      this._hide.perform();
    }
    Intercom.logout();
  }
}
