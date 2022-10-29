import Service, { service } from '@ember/service';
import { TrackedArray } from 'tracked-built-ins';
import EmberObject from '@ember/object';
import Sentry, { startSpan } from 'houseninja/utils/sentry';
import type IntercomService from 'houseninja/services/intercom';
import { isPresent } from '@ember/utils';
import RouterService from '@ember/routing/router-service';
import isNativePlatform from 'houseninja/utils/is-native-platform';

import type Notification from 'houseninja/lib/notification';
import Evented from '@ember/object/evented';
import { bind } from '@ember/runloop';

export default class NotificationsService extends Service.extend(Evented) {
  @service declare intercom: IntercomService;
  @service declare router: RouterService;

  // set to true on initialization
  // @see app/instance-initializers/notifications.js
  canShowRemoteNotifications = false;

  // set to true on initialization
  // @see app/instance-initializers/notifications.js
  canShowLocalNotifications = false;

  queue = new TrackedArray<Notification>();
  events = new TrackedArray<Notification>();
  // bus = new TrackedMap<string, Notification>();

  /**
   * Add notification to the queue
   *
   * @param {Object} notification
   */
  add(kind: string, state: string, notification: Notification): void {
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

  // remove(id: string): void {
  //   this.queue.removeObject(this.find(id));
  // }

  // findBy(keyId: string, key: string): Notification | unknown {
  //   return this.queue.findBy(keyId as never, key);
  // }

  // find(id: string): Notification | unknown {
  //   return this.findBy('id', id);
  // }

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
      this.on(
        'push-notifications.push-notification-action-performed',
        bind(this, this.notificationHandler)
      );
    }
  }
}
