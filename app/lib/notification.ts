import type { PushNotificationSchema } from '@capacitor/push-notifications';
import type {
  Attachment,
  DeliveredNotificationSchema,
  LocalNotificationSchema,
  Schedule,
} from '@capacitor/local-notifications';

export type NotificationSchema = LocalNotificationSchema &
  DeliveredNotificationSchema &
  PushNotificationSchema;

export enum NotificationType {
  Local = 'local',
  Remote = 'remote',
}

export type NotificationId = string | number;

export interface Notification {
  /**
   * The notification identifier.
   *
   * @type local, remote
   * @platform ios, android
   */
  id: NotificationId;

  /**
   * Push or local notification.
   *
   * @type local, remote
   * @platform ios, android
   */
  type: NotificationType;

  /**
   * The notification title.
   *
   * @type local, remote
   * @platform ios, android
   */
  title?: string;

  /**
   * The notification subtitle.
   *
   * @type remote
   * @platform ios, android
   */
  subtitle?: string;

  /**
   * The main text payload for the notification.
   *
   * @type local, remote
   * @platform ios, android
   */
  body?: string;

  /**
   * The notification tag.
   *
   * @type local, remote
   * @platform android
   */
  tag?: string;

  /**
   * The number to display for the app icon badge.
   *
   * @type remote
   * @platform ios, android
   */
  badge?: number;

  /**
   * Any additional data that was included in the
   * push notification payload.
   *
   * @type local, remote
   * @platform ios, android
   */
  data?: any;

  /**
   * The action to be performed on the user opening the notification.
   *
   * @type remote
   * @platform android
   */
  click_action?: string;

  /**
   * Deep link from the notification.
   *
   * @type remote
   * @platform android
   */
  link?: string;

  /**
   * Set the group identifier for notification grouping.
   *
   * @type local, remote
   * @platform android
   */
  group?: string;

  /**
   * Designate this notification as the summary for an associated `group`.
   *
   * @type local, remote
   * @platform android
   */
  groupSummary?: boolean;

  /**
   * Set extra data to store within this notification.
   *
   * @type local
   * @platform android,ios
   */
  extra?: any;

  /**
   * Sets a multiline text block for display in a big text notification style.
   *
   * @type local
   * @platform ios, android
   */
  largeBody?: string;

  /**
   * Used to set the summary text detail in inbox and big text notification styles.
   *
   * @type local
   * @platform android
   */
  summaryText?: string;

  /**
   * Name of the audio file to play when this notification is displayed.
   *
   * Include the file extension with the filename.
   *
   * On iOS, the file should be in the app bundle.
   * On Android, the file should be in res/raw folder.
   *
   * Recommended format is `.wav` because is supported by both iOS and Android.
   *
   * Only available for iOS and Android < 26.
   * For Android 26+ use channelId of a channel configured with the desired sound.
   *
   * If the sound file is not found, (i.e. empty string or wrong name)
   * the default system notification sound will be used.
   * If not provided, it will produce the default sound on Android and no sound on iOS.
   *
   * @type local
   * @platform ios, android
   */
  sound?: string;

  /**
   * Set a custom status bar icon.
   *
   * If set, this overrides the `smallIcon` option from Capacitor
   * configuration.
   *
   * Icons should be placed in your app's `res/drawable` folder. The value for
   * this option should be the drawable resource ID, which is the filename
   * without an extension.
   *
   * @type local
   * @platform android
   */
  smallIcon?: string;

  /**
   * Set a large icon for notifications.
   *
   * Icons should be placed in your app's `res/drawable` folder. The value for
   * this option should be the drawable resource ID, which is the filename
   * without an extension.
   *
   * @type local
   * @platform android
   */
  largeIcon?: string;

  /**
   * Set the color of the notification icon.
   *
   * @type local
   * @platform android
   */
  iconColor?: string;

  /**
   * Set attachments for this notification.
   *
   * @type local
   * @platform ios, android
   */
  attachments?: Attachment[];

  /**
   * Associate an action type with this notification.
   *
   * @type local
   * @platform ios, android
   */
  actionTypeId?: string;

  /**
   * Used to group multiple notifications.
   *
   * Sets `threadIdentifier` on the
   * [`UNMutableNotificationContent`](https://developer.apple.com/documentation/usernotifications/unmutablenotificationcontent).
   *
   * @type local
   * @platform ios
   */
  threadIdentifier?: string;

  /**
   * The string this notification adds to the category's summary format string.
   *
   * Sets `summaryArgument` on the
   * [`UNMutableNotificationContent`](https://developer.apple.com/documentation/usernotifications/unmutablenotificationcontent).
   *
   * @type local
   * @platform ios
   */
  summaryArgument?: string;

  /**
   * Specifies the channel the notification should be delivered on.
   *
   * If channel with the given name does not exist then the notification will
   * not fire. If not provided, it will use the default channel.
   *
   * Calls `setChannelId()` on
   * [`NotificationCompat.Builder`](https://developer.android.com/reference/androidx/core/app/NotificationCompat.Builder)
   * with the provided value.
   *
   * @type local
   * @platform android
   */
  channelId?: string;

  /**
   * If true, the notification can't be swiped away.
   *
   * Calls `setOngoing()` on
   * [`NotificationCompat.Builder`](https://developer.android.com/reference/androidx/core/app/NotificationCompat.Builder)
   * with the provided value.
   *
   * @type local
   * @platform android
   */
  ongoing?: boolean;

  /**
   * If true, the notification is canceled when the user clicks on it.
   *
   * Calls `setAutoCancel()` on
   * [`NotificationCompat.Builder`](https://developer.android.com/reference/androidx/core/app/NotificationCompat.Builder)
   * with the provided value.
   *
   * @type local
   * @platform android
   */
  autoCancel?: boolean;

  /**
   * Sets a list of strings for display in an inbox style notification.
   *
   * Up to 5 strings are allowed.
   *
   * @type local
   * @platform android
   */
  inboxList?: string[];

  /**
   * Schedule this notification for a later time.
   *
   * @type local
   * @platform ios, android
   */
  schedule?: Schedule;
}

export class Notification implements Notification {
  type: NotificationType;
  id: NotificationId;
  title?: string;
  body?: string;
  data?: any; // extra
  group?: string;
  groupSummary?: boolean;
  tag?: string;

  // push
  subtitle?: string;
  badge?: number;
  click_action?: string;
  link?: string;

  // local
  extra?: any;
  largeBody?: string;
  summaryText?: string;
  sound?: string;
  smallIcon?: string;
  largeIcon?: string;
  iconColor?: string;
  channelId?: string;
  threadIdentifier?: string;
  summaryArgument?: string;
  ongoing?: boolean;
  autoCancel?: boolean;
  inboxList?: string[];
  actionTypeId?: string;
  attachments?: Attachment[];
  schedule?: Schedule;

  constructor(notification: NotificationSchema, type = NotificationType.Local) {
    this.type = type;
    this.id = notification.id;
    Object.assign(this, notification);
  }

  /**
   * Fetch data or body from the notification.
   */
  get payload(): any {
    return this.data ?? this.extra;
  }
}

export default Notification;
