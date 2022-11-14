import Service from '@ember/service';
import { service } from '@ember/service';
import { Intercom } from '@capacitor-community/intercom';
import isNativePlatform from 'houseninja/utils/is-native-platform';
import ENV from 'houseninja/config/environment';
import Sentry, { captureException, startSpan } from 'houseninja/utils/sentry';
import { tracked } from '@glimmer/tracking';
import { TrackedWeakSet } from 'tracked-built-ins';
import { bind } from '@ember/runloop';

import type CurrentService from 'houseninja/services/current';
import type MetricsService from 'houseninja/services/metrics';
import type EventBusService from 'houseninja/services/event-bus';
import { debug } from '@ember/debug';
import { ListenablePlugin } from 'houseninja';

export default class IntercomService extends Service {
  @service declare current: CurrentService;
  @service declare eventBus: EventBusService;
  @service declare metrics: MetricsService;

  @tracked unreadConversationCount = 0;
  @tracked isOpen = false;

  listeners = new TrackedWeakSet();
  plugin: typeof Intercom = Intercom;
  pluginName = 'Intercom';
  events = [
    'didStartNewConversation',
    'helpCenterWillShow',
    'helpCenterDidShow',
    'helpCenterWillHide',
    'helpCenterDidHide',
    'onUnreadCountChange',
    'windowWillShow',
    'windowDidShow',
    'windowWillHide',
    'windowDidHide',
  ];

  async setup(): Promise<void> {
    debug('[intercom] setup');
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
    this.setupListeners();
  }

  async loginUser(userId: string, email: string, hmac: string): Promise<void> {
    debug('[intercom] logging in user');
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

  setupListeners(): void {
    this.eventBus.on(
      'intercom.on-unread-count-change',
      bind(this, this.handleUnreadConvoCount)
    );
    this.eventBus.on(
      'intercom.window-did-hide',
      bind(this, this.handleWindowDidHide)
    );
  }

  teardownListeners(): void {
    this.removeAllListeners();
  }

  async showMessenger(): Promise<void> {
    debug('[intercom] showing messenger');
    startSpan({ op: 'intercom.show.messenger' })?.finish();
    this.isOpen = true;
    this.metrics.trackEvent({
      event: 'intercom.open',
      breadcrumb: {
        type: 'ui',
        message: 'showing messenger',
      },
    });
    try {
      await Intercom.displayMessenger();
    } catch (e) {
      captureException(e as Error);
    }
  }

  async showComposer(message: string): Promise<void> {
    debug('[intercom] showing composer');
    startSpan({ op: 'intercom.show.composer' })?.finish();
    this.isOpen = true;
    this.metrics.trackEvent({
      event: 'intercom.open',
      properties: { message },
      breadcrumb: {
        type: 'ui',
        message: 'showing composer',
      },
    });
    try {
      await Intercom.displayMessageComposer({ message });
    } catch (e) {
      captureException(e as Error);
    }
  }

  async hide(): Promise<void> {
    debug('[intercom] hiding messenger');
    startSpan({ op: 'intercom.hide' })?.finish();
    this.metrics.trackEvent({
      event: 'intercom.hide',
      breadcrumb: {
        type: 'ui',
        message: 'hiding messenger',
      },
    });
    this.isOpen = false;
    try {
      await Intercom.hideMessenger();
    } catch (e) {
      captureException(e as Error);
    }
  }

  async logout(): Promise<void> {
    debug('[intercom] logging out user');
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

  async fetchUnreadConversationCount(): Promise<number> {
    try {
      const { value } = await Intercom.unreadConversationCount();
      return Number(value);
    } catch (e) {
      captureException(e as Error);
    }
    return 0;
  }

  private handleUnreadConvoCount({ value }: { value: string }): void {
    this.unreadConversationCount = value ? parseInt(value) : 0;
  }

  private handleWindowDidHide(): void {
    this.metrics.trackEvent({ event: 'intercom.close' });
  }

  async registerEvents(): Promise<void> {
    await this.removeAllListeners();
    await this.eventBus.registerEvents(
      this.plugin as ListenablePlugin,
      this.pluginName,
      this.events
    );
  }

  private async removeAllListeners(): Promise<void> {
    await Intercom.removeAllListeners();
  }
}
