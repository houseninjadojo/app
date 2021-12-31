import { PushNotifications } from '@capacitor/push-notifications';
import { run } from '@ember/runloop';

/**
 * @see https://capacitorjs.com/docs/apis/push-notifications#register
 *
 * Register the app to receive push notifications.
 *
 * This method will trigger the 'registration' event with the push token or
 * 'registrationError' if there was a problem. It does not prompt the user for
 * notification permissions, use requestPermissions() first.
 */
export async function register() {
  return await run(async () => {
    return await PushNotifications.register();
  });
}

/**
 * @see https://capacitorjs.com/docs/apis/push-notifications#getdeliverednotifications
 *
 * Get a list of notifications that are visible on the notifications screen.
 *
 * @return {Object[]} PushNotificationSchema[]
 */
export async function getDeliveredNotifications() {
  return await run(async () => {
    let result = await PushNotifications.getDeliveredNotifications();
    return result.notifications;
  });
}

/**
 * @see https://capacitorjs.com/docs/apis/push-notifications#removedeliverednotifications
 *
 * Remove the specified notifications from the notifications screen.
 *
 * @param {Object[]} notifications PushNotificationSchema[]
 */
export async function removeDeliveredNotifications(notifications) {
  return await run(async () => {
    return await PushNotifications.removeDeliveredNotifications({
      delivered: notifications,
    });
  });
}

/**
 * @see https://capacitorjs.com/docs/apis/push-notifications#removealldeliverednotifications
 *
 * Remove all the notifications from the notifications screen.
 */
export async function removeAllDeliveredNotifications() {
  return await run(async () => {
    return await PushNotifications.removeAllDeliveredNotifications();
  });
}

/**
 * @see https://capacitorjs.com/docs/apis/push-notifications#createchannel
 *
 * Create a notification channel.
 * Only available on Android O or newer (SDK 26+).
 *
 * @param {Object} @see https://capacitorjs.com/docs/apis/push-notifications#channel
 */
export async function createChannel(channel) {
  return await run(async () => {
    return await PushNotifications.createChannel(channel);
  });
}

/**
 * @see https://capacitorjs.com/docs/apis/push-notifications#deleteChannel
 *
 * Delete a notification channel.
 * Only available on Android O or newer (SDK 26+).
 *
 * @param {Object} @see https://capacitorjs.com/docs/apis/push-notifications#channel
 */
export async function deleteChannel(channel) {
  return await run(async () => {
    return await PushNotifications.deleteChannel(channel);
  });
}

/**
 * @see https://capacitorjs.com/docs/apis/push-notifications#listchannels
 *
 * Get a list of notification channels.
 * Only available on Android O or newer (SDK 26+).
 *
 * @return {Object[]} @see https://capacitorjs.com/docs/apis/push-notifications#channel
 */
export async function listChannels() {
  return await run(async () => {
    let result = await PushNotifications.listChannels();
    return result.channels;
  });
}

/**
 * @see https://capacitorjs.com/docs/apis/push-notifications#checkpermissions
 *
 * Check permission to receive push notifications.
 *
 * On Android the status is always granted because you can always receive
 * push notifications. If you need to check if the user allows to display
 * notifications, use local-notifications plugin.
 *
 * @return {String} 'prompt' | 'prompt-with-rationale' | 'granted' | 'denied'
 */
export async function checkPermissions() {
  return await run(async () => {
    let result = await PushNotifications.checkPermissions();
    return result.receive;
  });
}

/**
 * @see https://capacitorjs.com/docs/apis/push-notifications#requestpermissions
 *
 * Request permission to receive push notifications.
 *
 * On Android it doesn’t prompt for permission because you can always receive
 * push notifications.
 *
 * On iOS, the first time you use the function, it will prompt the user for push
 * notification permission and return granted or denied based on the user selection.
 * On following calls it will currect status of the permission without prompting again.
 *
 * @return {String} 'prompt' | 'prompt-with-rationale' | 'granted' | 'denied'
 */
export async function requestPermissions() {
  return await run(async () => {
    let result = await PushNotifications.requestPermissions();
    return result.receive;
  });
}

/**
 * @see https://capacitorjs.com/docs/apis/push-notifications#addlistenerregistration
 *
 * - Called when the push notification registration finishes without problems.
 *
 * @event 'registration'
 * @param {String} eventName 'registration'
 * @param {Function} listenerFunc (token: Token) => void
 * @example
 *   addListener('registration', (token) => { this.device.set('pushRegistrationToken', token); })
 *
 * @see https://capacitorjs.com/docs/apis/push-notifications#addlistenerregistrationerror
 *
 * - Called when the push notification registration finished with problems.
 *
 * @event 'registrationError'
 * @param {String} eventName 'registrationError'
 * @param {Function} listenerFunc (error: any) => void
 * @example
 *   addListener('registrationError', (error) => { console.error(error); })
 *
 * @see https://capacitorjs.com/docs/apis/push-notifications#addlistenerpushnotificationreceived
 *
 * - Called when the device receives a push notification.
 *
 * @event 'pushNotificationReceived'
 * @param {String} eventName 'pushNotificationReceived'
 * @param {Function} listenerFunc (notification: PushNotificationSchema) => void
 * @example
 *   addListener('pushNotificationReceived', (notification) => { this.notifications.received(notification); })
 *
 * @see https://capacitorjs.com/docs/apis/push-notifications#addlistenerpushnotificationactionperformed
 *
 * - Called when an action is performed on a push notification.
 *
 * @event 'pushNotificationActionPerformed'
 * @param {String} eventName 'pushNotificationActionPerformed'
 * @param {Function} listenerFunc (notification: { actionId, inputValue, notification }) => void
 * @param {String} listenerFunc.notification.actionId The action performed on the notification.
 * @param {String} listenerFunc.notification.inputValue Text entered on the notification action. Only available on iOS.
 * @param {Object} listenerFunc.notification.notification [PushNotificationSchema] The notification in which the action was performed.
 * @example
 *   addListener('pushNotificationActionPerformed', ({ actionId, inputValue, notification }) => {
 *     this.chatroom.respond(notification.data.chatroomId, {
 *       user: current.user.id,
 *       message: inputValue,
 *     });
 *   })
 *
 * @param {String} eventName
 * @param {Function} callback
 * @return {Promise<Object>} { remove: () => Promise<void> } call `remove()` to remove listener
 */
export async function addListener(eventName, listenerFunc) {
  return await run(async () => {
    return await PushNotifications.addListener(eventName, listenerFunc);
  });
}

/**
 * @see https://capacitorjs.com/docs/apis/push-notifications#removealllisteners
 *
 * Remove all native listeners for this plugin.
 */
export async function removeAllListeners() {
  return await run(async () => {
    return await PushNotifications.removeAllListeners();
  });
}
