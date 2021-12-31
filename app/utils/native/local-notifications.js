import { LocalNotifications } from '@capacitor/local-notifications';
import { run } from '@ember/runloop';
import EmberObject from '@ember/object';
import { A } from '@ember/array';

/**
 * @see https://capacitorjs.com/docs/apis/local-notifications#schedule
 *
 * Schedule one or more local notifications.
 *
 * @param {Object[]} notifications LocalNotificationSchema[]
 * @return {Object[]} LocalNotificationDescriptor[]
 */
export async function schedule(notifications) {
  return await run(async () => {
    notifications = [notifications].flat();
    let result = await LocalNotifications.schedule({ notifications });
    return A(result.notifications);
  });
}

/**
 * @see https://capacitorjs.com/docs/apis/local-notifications#getpending
 *
 * Get a list of pending notifications.
 *
 * @return {Object[]}  PendingLocalNotificationSchema[]
 */
export async function getPending() {
  return await run(async () => {
    let result = await LocalNotifications.getPending();
    let notifications = result.notifications.map((n) => {
      return new EmberObject(n);
    });
    return A(notifications);
  });
}

/**
 * @see https://capacitorjs.com/docs/apis/local-notifications#registeractiontypes
 *
 * Register actions to take when notifications are displayed.
 * Only available for iOS and Android.
 *
 * @param {Object[]} types ActionType[]
 */
export async function registerActionTypes(types) {
  return await run(async () => {
    types = [types].flat();
    return await LocalNotifications.registerActionTypes({ types });
  });
}

/**
 * @see https://capacitorjs.com/docs/apis/local-notifications#cancel
 *
 * Cancel pending notifications.
 *
 * @param {Object[]} notifications LocalNotificationDescriptor[]
 */
export async function cancel(notifications) {
  return await run(async () => {
    notifications = [notifications].flat();
    let result = LocalNotifications.cancel(notifications);
    return A(result.notifications);
  });
}

/**
 * @see https://capacitorjs.com/docs/apis/local-notifications#createchannel
 *
 * Create a notification channel.
 * Only available for Android.
 *
 * @param {Object} @see https://capacitorjs.com/docs/apis/local-notifications#channel
 */
export async function createChannel(channel) {
  return await run(async () => {
    return await LocalNotifications.createChannel(channel);
  });
}

/**
 * @see https://capacitorjs.com/docs/apis/local-notifications#deletechannel
 *
 * Delete a notification channel.
 * Only available for Android.
 *
 * @param {Object} @see https://capacitorjs.com/docs/apis/local-notifications#channel
 */
export async function deleteChannel(channel) {
  return await run(async () => {
    return await LocalNotifications.deleteChannel(channel);
  });
}

/**
 * @see https://capacitorjs.com/docs/apis/local-notifications#listchannels
 *
 * Get a list of notification channels.
 * Only available for Android.
 *
 * @return {Object[]} @see https://capacitorjs.com/docs/apis/local-notifications#channel
 */
export async function listChannels() {
  return await run(async () => {
    let result = await LocalNotifications.listChannels();
    return result.channels;
  });
}

/**
 * @see https://capacitorjs.com/docs/apis/local-notifications#checkpermissions
 *
 * Check permission to display local notifications.
 *
 * @return {String} 'prompt' | 'prompt-with-rationale' | 'granted' | 'denied'
 */
export async function checkPermissions() {
  return await run(async () => {
    let result = await LocalNotifications.checkPermissions();
    return result.display;
  });
}

/**
 * @see https://capacitorjs.com/docs/apis/local-notifications#requestpermissions
 *
 * Request permission to display local notifications.
 *
 * @return {String} 'prompt' | 'prompt-with-rationale' | 'granted' | 'denied'
 */
export async function requestPermissions() {
  return await run(async () => {
    let result = await LocalNotifications.requestPermissions();
    return result.display;
  });
}
