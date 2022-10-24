import Service from '@ember/service';
import { service } from '@ember/service';
import { Intercom } from '@capacitor-community/intercom';
import isNativePlatform from 'houseninja/utils/is-native-platform';
import ENV from 'houseninja/config/environment';
import { task, type Task } from 'ember-concurrency';
import Sentry, { captureException, startSpan } from 'houseninja/utils/sentry';
import type EventBusService from './event-bus';

export default class IntercomService extends Service {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @service declare current: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @service declare analytics: any;
  @service declare eventBus: EventBusService;

  unreadConversationCount = 0;
  isOpen = false;

  async setup(): Promise<void> {
    Sentry.addBreadcrumb({
      category: 'intercom',
      message: 'setting up',
      level: 'info',
    });
    // hide launcher on mobile devices
    if (isNativePlatform()) {
      await Intercom.hideInAppMessages();
      await Intercom.hideLauncher();
    }
    this.setupListeners();
  }

  // eslint-disable-next-line
  async registerUser(userId: string, email: string, hmac: string): Promise<void> {
    startSpan({ op: 'intercom.user.register' })?.finish();
    Sentry.addBreadcrumb({
      category: 'intercom',
      message: 'attaching user',
      data: {
        user: { id: userId, email },
      },
      level: 'info',
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
    this.eventBus.on('intercom.on-unread-count-change', ({ value }) => {
      this.unreadConversationCount = value ? parseInt(value) : 0;
    });
  }

  async getUnreadCount(): Promise<number> {
    const { value } = await Intercom.unreadConversationCount();
    return value ? parseInt(value) : 0;
  }

  showMessenger(): void {
    this._showMessenger.perform();
  }

  _showMessenger: Task<void, []> = task(this, { drop: true }, async () => {
    startSpan({ op: 'intercom.show.messenger' })?.finish();
    Sentry.addBreadcrumb({
      category: 'intercom',
      message: 'showing messenger',
      level: 'info',
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
      category: 'intercom',
      message: 'showing composer',
      data: {
        message: message,
      },
      level: 'info',
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
      category: 'intercom',
      message: 'hiding messenger',
      level: 'info',
    });
    this.isOpen = false;
    await Intercom.hideMessenger();
  });

  logout(): void {
    startSpan({ op: 'intercom.user.logout' })?.finish();
    Sentry.addBreadcrumb({
      category: 'intercom',
      message: 'logging out',
      level: 'info',
    });
    if (this.isOpen) {
      this._hide.perform();
    }
    Intercom.logout();
  }
}
