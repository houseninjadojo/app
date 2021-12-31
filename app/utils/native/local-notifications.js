import { LocalNotifications } from '@capacitor/local-notifications';
import { run } from '@ember/runloop';
import { debug } from '@ember/debug';

/**
 * Schedule one or more local notifications.
 *
 * @param {Object[]} notifications LocalNotificationSchema[]
 * @return {Object[]} LocalNotificationDescriptor[]
 */
export async function schedule(notifications) {
  notifications = [notifications].flat();
  return await run(async () => {
    let result = await LocalNotifications.schedule({ notifications });
    return result.notifications;
  });
}

/**
 * Get a list of pending notifications.
 *
 * @return {Object[]}  PendingLocalNotificationSchema[]
 */
export async function getPending() {
  return await run(async () => {
    let result = await LocalNotifications.getPending();
    return result.notifications;
  });
}

/**
 * Register actions to take when notifications are displayed.
 * Only available for iOS and Android.
 *
 * @param {Object} options - 	RegisterActionTypesOptions
 * @param {Object[]} options.types 	ActionType[]
 */
export async function registerActionTypes(options) {
  return await run(async () => {
    return await LocalNotifications.registerActionTypes(options);
  });
}

/**
 * Cancel pending notifications.
 *
 * @param {Object} options CancelOptions
 * @param {Object[]} options.notifications LocalNotificationDescriptor[]
 */
export async function cancel(options) {
  return await run(async () => {
    return await LocalNotifications.cancel(options);
  });
}
