import Service, { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { A } from '@ember/array';
import EmberObject from '@ember/object';
import Sentry, { startSpan } from 'houseninja/utils/sentry';
// import { PushNotifications } from '@capacitor/push-notifications';
import {
  PushNotifications,
  type PushNotificationSchema,
} from '@capacitor/push-notifications';
import type { DeliveredNotificationSchema } from '@capacitor/local-notifications';
import type IntercomService from 'houseninja/services/intercom';
import { isPresent } from '@ember/utils';
import RouterService from '@ember/routing/router-service';
import isNativePlatform from 'houseninja/utils/is-native-platform';
// import { bind } from '@ember/runloop';
import type EventBusService from 'houseninja/services/event-bus';

type Notification = PushNotificationSchema | DeliveredNotificationSchema;
// const PushNotificationEvents = [
//   'push-notifications.registration',
//   'push-notifications.registration-error',
//   'push-notifications.push-notification-received',
//   'push-notifications.push-notification-action-performed',
// ];

export default class NotificationsService extends Service {
  @service declare eventBus: EventBusService;
  @service declare intercom: IntercomService;
  @service declare router: RouterService;

  // set to true on initialization
  // @see app/instance-initializers/notifications.js
  canShowRemoteNotifications = false;

  // set to true on initialization
  // @see app/instance-initializers/notifications.js
  canShowLocalNotifications = false;

  @tracked queue = A();
  @tracked events = A();

  @tracked bootNotification: Notification | null = null;

  /**
   * Add notification to the queue
   *
   * @param {Object} notification
   */
  add(kind: string, state: string, notification: Notification) {
    startSpan({
      op: 'notification.add',
      description: `${notification.id}`,
      data: { notification },
      tags: {
        kind,
        state,
      },
    })?.finish();
    Sentry.addBreadcrumb({
      category: 'notifications.add',
      message: `Adding ${kind} notification to queue`,
      data: { kind, state, notification },
    });
    this.queue.pushObject(
      EmberObject.create({
        kind,
        state,
        ...notification,
      })
    );
  }

  remove(id: string): void {
    this.queue.removeObject(this.find(id));
  }

  findBy(keyId: string, key: string): Notification | unknown {
    return this.queue.findBy(keyId as never, key);
  }

  find(id: string): Notification | unknown {
    return this.findBy('id', id);
  }

  triggerEvent(notification: Notification): void {
    const span = startSpan({
      op: 'notification.event',
      description: `${notification.id}`,
      data: { notification },
      tags: {
        notification: notification.id,
      },
    });
    this.events.pushObject(EmberObject.create(notification));
    if (notification.data.intercom_push_type === 'notification') {
      span?.setTag('intercom', true);
      Sentry.addBreadcrumb({
        category: 'notifications.handle',
        message: 'Handling Intercom Push Notification',
        data: notification,
      });
      span?.finish();
      this.intercom.showMessenger();
      return;
    } else if (isPresent(notification.data.deeplink_path)) {
      span?.setTag('deep-link', true);
      Sentry.addBreadcrumb({
        category: 'notifications.handle',
        message: 'Handling Branch Push Notification',
        data: notification,
      });
      span?.finish();
      this.router.transitionTo(notification.data.deeplink_path);
      return;
    } else {
      span?.finish();
    }
  }

  // eslint-disable-next-line prettier/prettier
  notificationHandler({ actionId, notification }: { actionId: string; notification: Notification; }): void {
    startSpan({
      op: 'notification.action',
      description: `${actionId}`,
      data: { notification },
      tags: {
        notification: notification.id,
        action: actionId,
      },
    })?.finish();
    this.add('remote', 'received', notification);
    this.triggerEvent(notification);
  }

  setup(): void {
    if (isNativePlatform()) {
      startSpan({
        op: 'notification.setup',
        description: `setting up`,
      })?.finish();
      this.setupListeners();
    }
  }

  setupListeners(): void {
    this.eventBus.on(
      'push-notifications.push-notification-action-performed',
      this.notificationHandler.bind(this)
    );
  }

  async teardownListeners(): Promise<void> {
    this.eventBus.off(
      'push-notifications.push-notification-action-performed',
      this.notificationHandler.bind(this)
    );
    await this.removeAllListeners();
  }

  async registerEvents(): Promise<void> {
    const pushNotificationEvents = [
      'registration',
      'registrationError',
      'pushNotificationReceived',
      'pushNotificationActionPerformed',
    ];
    if (isNativePlatform()) {
      await this.eventBus.registerEvents(
        PushNotifications,
        'PushNotifications',
        pushNotificationEvents
      );
    }
  }

  async removeAllListeners(): Promise<void> {
    await PushNotifications.removeAllListeners();
  }
}
