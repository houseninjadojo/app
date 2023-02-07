import Service, { service } from '@ember/service';
import { captureException } from 'houseninja/services/telemetry';
import { PushNotifications } from '@capacitor/push-notifications';
import isNativePlatform from 'houseninja/utils/is-native-platform';
import { bind } from '@ember/runloop';
import { TrackedArray, TrackedMap, tracked } from 'tracked-built-ins';
import { getToken } from 'houseninja/utils/native/fcm';

import {
  Notification,
  NotificationState,
  NotificationType,
  type NotificationSchema,
} from 'houseninja/lib/notification';
import type CurrentService from './current';
import EventBusService, {
  ListenablePlugin,
} from 'houseninja/services/event-bus';
import type IntercomService from 'houseninja/services/intercom';
import type RouterService from '@ember/routing/router-service';
import { debug } from '@ember/debug';
import MetricsService from 'ember-metrics/services/metrics';

type ActionPayload = {
  actionId: string;
  inputValue?: string;
  notification: NotificationSchema;
};

type Tokens = {
  apns?: string;
  fcm?: string;
};

/**
 * @class NotificationsService
 */
export default class NotificationsService extends Service {
  @service declare current: CurrentService;
  @service declare eventBus: EventBusService;
  @service declare intercom: IntercomService;
  @service declare metrics: MetricsService;
  @service declare router: RouterService;

  plugin = PushNotifications;
  pluginName = 'PushNotifications';
  events = [
    'registration',
    'registrationError',
    'pushNotificationReceived',
    'pushNotificationActionPerformed',
  ];

  queue: any[] = new TrackedArray([]); // eslint-disable-line @typescript-eslint/no-explicit-any
  eventLog: Notification[] = new TrackedArray([]);
  heap = new TrackedMap();

  tokens: Tokens = tracked({
    apns: undefined,
    fcm: undefined,
  });

  private findOrCreate(payload: NotificationSchema): Notification {
    if (this.heap.has(payload.id)) {
      return this.heap.get(payload.id) as Notification;
    } else {
      const n = new Notification(payload, NotificationState.Received);
      this.heap.set(n.id, n);
      return n;
    }
  }

  /**
   * Handle Actions
   */

  triggerEvent(notification: Notification): void {
    const n = notification;
    this.eventLog.push(n);
    switch (n.type) {
      case NotificationType.Intercom:
        this.intercom.show();
        return;
      case NotificationType.Branch:
        this.router.transitionTo(n.link as string);
        return;
      case NotificationType.Remote:
        this.router.transitionTo(n.link as string);
        return;
      default:
        return;
    }
  }

  /**
   * Handlers
   */

  private actionHandler({ actionId, notification }: ActionPayload): void {
    const n = this.findOrCreate(notification);
    n.state = NotificationState.Opened;
    debug(`[notifications] handling action: ${actionId}`);
    this.metrics.trackEvent({
      event: 'notification.opened',
      properties: { actionId, notification },
    });
    this.eventLog.push(n);
    this.triggerEvent(n);
  }

  private receivedHandler(payload: NotificationSchema): void {
    const n = new Notification(payload, NotificationState.Received);
    debug(`[notifications] received notification: ${n.id}`);
    this.metrics.trackEvent({
      event: 'notification.received',
      properties: { payload },
    });
    this.heap.set(n.id, n);
  }

  private async registrationHandler(evt: { value: string }): Promise<void> {
    debug(`[notifications] permission granted`);
    this.tokens.apns = evt.value;
    this.tokens.fcm = await getToken();
    this.current.setDeviceTokens(this.tokens);
  }

  private async registrationErrHandler(evt: { error: string }): Promise<void> {
    debug(`[notifications] permission denied`);
    const error = new Error(evt.error);
    captureException(error);
  }

  /**
   * Listeners
   */

  async setup(): Promise<void> {
    if (!isNativePlatform()) return;
    await this.setupListeners();
    await this.registerPermissions();
  }

  setupListeners(): void {
    this.eventBus.on('push-notifications.push-notification-received', bind(this, this.receivedHandler)); // eslint-disable-line prettier/prettier
    this.eventBus.on('push-notifications.push-notification-action-performed', bind(this, this.actionHandler)); // eslint-disable-line prettier/prettier
    this.eventBus.on('push-notifications.registration', bind(this, this.registrationHandler)); // eslint-disable-line prettier/prettier
    this.eventBus.on('push-notifications.registration-error', bind(this, this.registrationErrHandler)); // eslint-disable-line prettier/prettier
  }

  async teardownListeners(): Promise<void> {
    await this.removeAllListeners();
  }

  async registerEvents(): Promise<void> {
    this.removeAllListeners();
    if (isNativePlatform()) {
      await this.eventBus.registerEvents(
        this.plugin as ListenablePlugin,
        this.pluginName,
        this.events
      );
    }
  }

  async removeAllListeners(): Promise<void> {
    if (!isNativePlatform()) return;
    await PushNotifications.removeAllListeners();
  }

  /**
   * Permissions
   */

  async canRequestPermissions(): Promise<boolean> {
    if (!isNativePlatform()) return false;
    const { receive: state } = await PushNotifications.checkPermissions();
    debug(`[notifications] permissions state: ${state}`);
    return state === 'prompt' || state === 'prompt-with-rationale';
  }

  async registerPermissions(): Promise<void> {
    debug(`[notifications] trying to register permissions`);
    if (!isNativePlatform()) {
      debug('[notifications] not a native platform, not registering');
      return;
    }
    const { receive: state } = await PushNotifications.requestPermissions();
    if (state === 'granted') {
      await PushNotifications.register();
    }
  }
}
