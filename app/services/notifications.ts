import Service, { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { A } from '@ember/array';
import EmberObject from '@ember/object';
import Sentry, { startSpan } from 'houseninja/utils/sentry';
import { PushNotifications } from '@capacitor/push-notifications';
import type { PushNotificationSchema } from '@capacitor/push-notifications';
import type { DeliveredNotificationSchema } from '@capacitor/local-notifications';
import type IntercomService from 'houseninja/services/intercom';
import { isPresent } from '@ember/utils';
import RouterService from '@ember/routing/router-service';

type Notification = PushNotificationSchema | DeliveredNotificationSchema;

export default class NotificationsService extends Service {
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
      category: 'notifications',
      message: `Adding ${kind} notification to queue`,
      level: 'info',
      data: {
        kind,
        state,
        notification,
      },
    });
    this.queue.pushObject(
      EmberObject.create({
        kind,
        state,
        ...notification,
      })
    );
  }

  remove(id: string) {
    this.queue.removeObject(this.find(id));
  }

  findBy(keyId: string, key: string) {
    return this.queue.findBy(keyId as never, key);
  }

  find(id: string) {
    return this.findBy('id', id);
  }

  triggerEvent(notification: Notification) {
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
        category: 'push-notification',
        message: 'Handling Intercom Push Notification',
        data: notification,
        level: 'info',
      });
      span?.finish();
      this.intercom.showMessenger();
      return;
    } else if (isPresent(notification.data.deeplink_path)) {
      span?.setTag('deep-link', true);
      Sentry.addBreadcrumb({
        category: 'push-notification',
        message: 'Handling Branch Push Notification',
        data: notification,
        level: 'info',
      });
      span?.finish();
      this.router.transitionTo(notification.data.deeplink_path);
      return;
    } else {
      span?.finish();
    }
  }

  // eslint-disable-next-line prettier/prettier
  notificationHandler({ actionId, notification }: { actionId: string; notification: Notification; }) {
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

  setup() {
    startSpan({
      op: 'notification.setup',
      description: `setting up`,
    })?.finish();
    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      this.notificationHandler.bind(this)
    );
  }
}
