import { FirebaseMessaging } from '@capacitor-firebase/messaging';
import { run } from '@ember/runloop';

type PermissionState =
  | 'prompt'
  | 'prompt-with-rationale'
  | 'granted'
  | 'denied';

/**
 * @see https://github.com/capawesome-team/capacitor-firebase/tree/main/packages/messaging
 *
 * Capacitor plugin for Firebase Cloud Messaging (FCM).
 */

/**
 * subscribe to fcm topic
 *
 * @platform ios, android
 *
 * @param {String} topic
 */
export async function subscribeTo(topic: string): Promise<void> {
  return await run(async () => {
    return await FirebaseMessaging.subscribeToTopic({ topic });
  });
}

/**
 * unsubscribe to fcm topic
 *
 * @platform ios, android
 *
 * @param {String} topic
 */
// eslint-disable-next-line prettier/prettier
export async function unsubscribeFrom(topic: string): Promise<void> {
  return await run(async () => {
    return await FirebaseMessaging.unsubscribeFromTopic({ topic });
  });
}

/**
 * get fcm token to eventually use from a server
 *
 * @platform ios, android
 *
 * @return {String} token
 */
export async function getToken(): Promise<string> {
  return await run(async () => {
    const { token } = await FirebaseMessaging.getToken();
    return token;
  });
}

/**
 * @platform ios, android
 */
export async function checkPermissions(): Promise<PermissionState> {
  return await run(async () => {
    const { receive } = await FirebaseMessaging.checkPermissions();
    return receive;
  });
}

/**
 * @platform ios, android
 */
export async function requestPermissions(): Promise<PermissionState> {
  return await run(async () => {
    const { receive } = await FirebaseMessaging.requestPermissions();
    return receive;
  });
}

/**
 * @platform ios, android
 */
export async function isSupported(): Promise<boolean> {
  return await run(async () => {
    const { isSupported } = await FirebaseMessaging.isSupported();
    return isSupported;
  });
}
