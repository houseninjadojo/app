import type { PushNotificationSchema } from '@capacitor/push-notifications';

export type NotificationType = 'local' | 'remote';
export type NotificationId = string;

// export interface Notification {
//   id: NotificationId;
//   type: NotificationType;
//   title?: string;
//   subtitle?: string;
//   body?: string;
//   tag?: string;
//   badge?: number;
//   data: any;
//   clickAction?: string;
//   link?: string;
//   group?: string;
//   groupSummary?: boolean;
// }

export class Notification implements Notification {
  /**
   * The notification identifier.
   *
   * @platform ios, android
   */
  id: NotificationId;

  /**
   * Push or local notification.
   *
   * @platform ios, android
   */
  type: NotificationType = 'remote';

  /**
   * The notification title.
   *
   * @platform ios, android
   */
  title?: string;

  /**
   * The notification subtitle.
   *
   * @platform ios, android
   */
  subtitle?: string;

  /**
   * The main text payload for the notification.
   *
   * @platform ios, android
   */
  body?: string;

  /**
   * The notification tag.
   *
   * @platform android
   */
  tag?: string;

  /**
   * The number to display for the app icon badge.
   *
   * @platform ios, android
   */
  badge?: number;

  /**
   * Any additional data that was included in the
   * push notification payload.
   *
   * @platform ios, android
   */
  data: any;

  /**
   * The action to be performed on the user opening the notification.
   *
   * @platform android
   */
  clickAction?: string;

  /**
   * Deep link from the notification.
   *
   * @platform android
   */
  link?: string;

  /**
   * Set the group identifier for notification grouping.
   *
   * @platform android
   */
  group?: string;

  /**
   * Designate this notification as the summary for an associated `group`.
   *
   * @platform android
   */
  groupSummary?: boolean;

  constructor(notification: PushNotificationSchema) {
    this.id = notification.id;
    this.type = 'remote';
    this.title = notification.title;
    this.subtitle = notification.subtitle;
    this.body = notification.body;
    this.tag = notification.tag;
    this.badge = notification.badge;
    this.data = notification.data;
    this.clickAction = notification.click_action;
    this.link = notification.link;
    this.group = notification.group;
    this.groupSummary = notification.groupSummary;
  }
}

export default Notification;
