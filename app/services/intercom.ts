import Service from '@ember/service';
import { service } from '@ember/service';
import { Intercom } from '@capacitor-community/intercom';
import isNativePlatform from 'houseninja/utils/is-native-platform';
import ENV from 'houseninja/config/environment';
import Sentry, { captureException, startSpan } from 'houseninja/utils/sentry';

import type CurrentService from 'houseninja/services/current';
import type MetricsService from 'houseninja/services/metrics';

export default class IntercomService extends Service {
  @service declare current: CurrentService;
  @service declare metrics: MetricsService;

  unreadConversationCount = '';
  isOpen = false;

  async setup(): Promise<void> {
    Sentry.addBreadcrumb({
      category: 'intercom.setup',
      message: 'setting up',
    });
    // hide launcher on mobile devices
    if (isNativePlatform()) {
      try {
        await Intercom.hideInAppMessages();
        await Intercom.hideLauncher();
      } catch (e) {
        captureException(e as Error);
      }
    }
  }

  async loginUser(userId: string, email: string, hmac: string): Promise<void> {
    startSpan({ op: 'intercom.user.register' })?.finish();
    Sentry.addBreadcrumb({
      category: 'intercom.login',
      message: 'attaching user',
      data: {
        user: { id: userId, email },
      },
    });
    if (isNativePlatform()) {
      await this.loginUserNative(userId, email, hmac);
    } else {
      await this.loginUserWeb(userId, email, hmac);
    }
  }

  // eslint-disable-next-line prettier/prettier
  private async loginUserNative(userId: string, email: string, hmac: string): Promise<void> {
    try {
      await Intercom.setUserHash({ hmac });
      await Intercom.loginUser({
        userId,
        email,
      });
    } catch (e) {
      captureException(e as Error);
    }
  }

  // eslint-disable-next-line prettier/prettier
  private async loginUserWeb(userId: string, email: string, hmac: string): Promise<void> {
    try {
      await Intercom.boot({
        app_id: ENV.intercom.appId,
        user_id: userId,
        email,
        user_hash: hmac,
      });
    } catch (e) {
      captureException(e as Error);
    }
  }

  async setupListeners(): Promise<void> {
    await Intercom.addListener('onUnreadCountChange', ({ value }) => {
      this.unreadConversationCount = value ?? '';
    });
  }

  async showMessenger(): Promise<void> {
    startSpan({ op: 'intercom.show.messenger' })?.finish();
    Sentry.addBreadcrumb({
      category: 'intercom.show',
      message: 'showing messenger',
    });
    this.isOpen = true;
    this.metrics.trackEvent({ event: 'Intercom messenger opened' });
    try {
      await Intercom.displayMessenger();
    } catch (e) {
      captureException(e as Error);
    }
  }

  async showComposer(message: string): Promise<void> {
    startSpan({ op: 'intercom.show.composer' })?.finish();
    Sentry.addBreadcrumb({
      category: 'intercom.show',
      message: 'showing composer',
      data: { message },
    });
    this.isOpen = true;
    this.metrics.trackEvent({
      event: 'Intercom composer opened',
      properties: { message },
    });
    try {
      await Intercom.displayMessageComposer({ message });
    } catch (e) {
      captureException(e as Error);
    }
  }

  async hide(): Promise<void> {
    startSpan({ op: 'intercom.hide' })?.finish();
    Sentry.addBreadcrumb({
      category: 'intercom.hide',
      message: 'hiding messenger',
    });
    this.isOpen = false;
    try {
      await Intercom.hideMessenger();
    } catch (e) {
      captureException(e as Error);
    }
  }

  async logout(): Promise<void> {
    startSpan({ op: 'intercom.user.logout' })?.finish();
    Sentry.addBreadcrumb({
      category: 'intercom.logout',
      message: 'logging out',
    });
    if (this.isOpen) {
      await this.hide();
    }
    try {
      await Intercom.logout();
    } catch (e) {
      captureException(e as Error);
    }
  }

  async logEvent(name: string, data?: Record<string, unknown>): Promise<void> {
    startSpan({ op: 'intercom.event.log' })?.finish();
    Sentry.addBreadcrumb({
      category: 'intercom.event',
      message: 'logging event',
      data: { name, data },
    });
    try {
      await Intercom.logEvent({ name, data });
    } catch (e) {
      captureException(e as Error);
    }
  }
}
