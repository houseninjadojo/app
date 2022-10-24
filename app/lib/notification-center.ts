import {
  PushNotifications,
  PermissionStatus,
} from '@capacitor/push-notifications';
import { TrackedMap, TrackedSet } from 'tracked-built-ins';
import { tracked } from '@glimmer/tracking';

import Notification from 'houseninja/lib/notification';
import type { NotificationId } from 'houseninja/lib/notification';
import { captureException } from 'houseninja/utils/sentry';

enum PermissionState {
  Prompt = 'prompt',
  PromptWithRationale = 'prompt-with-rationale',
  Granted = 'granted',
  Denied = 'denied',
  Unknown = 'unknown',
}

export default class NotificationCenter {
  @tracked permissions: PermissionState = PermissionState.Unknown;

  notifications = new TrackedMap<NotificationId, Notification>();
  eventQueue = new TrackedMap<string, Notification>();
  removed = new TrackedSet<Notification>();

  /**
   * List notifications visible to the user.
   */
  async deliveredNotifications(): Promise<Notification[]> {
    const { notifications } =
      await PushNotifications.getDeliveredNotifications();
    return notifications.map((n) => new Notification(n)) || [];
  }

  /**
   * Remove a notification from the notification center.
   */
  async remove(notification: Notification): Promise<void>;
  async remove(id: NotificationId): Promise<void>;
  async remove(notificationOrId: Notification | NotificationId) {
    try {
      const notification =
        typeof notificationOrId === 'string'
          ? this.notifications.get(notificationOrId)
          : notificationOrId;
      if (notification) {
        this.removed.add(notification);
        await PushNotifications.removeDeliveredNotifications({
          notifications: [notification],
        });
        this.notifications.delete(notification.id);
      }
    } catch (error) {
      captureException(error as Error);
    }
  }

  /**
   * Remove all notifications from the notification center.
   */
  async removeAll(): Promise<void> {
    try {
      await PushNotifications.removeAllDeliveredNotifications();
      this.notifications.clear();
    } catch (error) {
      captureException(error as Error);
    }
  }

  /**
   * The number of notifications in the notification center.
   */
  size(): number {
    return this.notifications.size;
  }
  length(): number {
    return this.size();
  }

  /**
   * Permissions for displaying notifications.
   */
  async checkPermissions(): Promise<PermissionState> {
    const result: PermissionStatus = await PushNotifications.checkPermissions();
    const permission: PermissionState = (result.receive ??
      'unknown') as PermissionState;
    this.permissions = permission;
    return permission;
  }

  /**
   * Handle Notificaiton Action
   */
  // handleAction(actionId: string, inputValue: string, notification: Notification) {

  // }
}
