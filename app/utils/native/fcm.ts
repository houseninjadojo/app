import { FCM } from '@mineminemine/fcm';
import { run } from '@ember/runloop';

/**
 * @see https://github.com/capacitor-community/fcm
 *
 * Firebase Cloud Messaging (FCM) for Capacitor
 */

/**
 * subscribe to fcm topic
 *
 * platforms: ios, android
 *
 * @param {String} topic
 */
export async function subscribeTo(topic: string): Promise<{ message: string }> {
  return await run(async () => {
    return await FCM.subscribeTo({ topic });
  });
}

/**
 * unsubscribe to fcm topic
 *
 * platforms: ios, android
 *
 * @param {String} topic
 */
// eslint-disable-next-line prettier/prettier
export async function unsubscribeFrom(topic: string): Promise<{ message: string }> {
  return await run(async () => {
    return await FCM.unsubscribeFrom({ topic });
  });
}

/**
 * get fcm token to eventually use from a server
 *
 * platforms: ios, android
 *
 * @return {String} token
 */
export async function getToken(): Promise<string> {
  return await run(async () => {
    const { token } = await FCM.getToken();
    return token;
  });
}

/**
 * remove local fcm instance completely
 *
 * platforms: ios, android
 */
export async function deleteInstance(): Promise<boolean> {
  return await run(async () => {
    return await FCM.deleteInstance();
  });
}

/**
 * enable the auto initialization of the library
 *
 * platforms: ios, android
 *
 * @param {Boolean} [enabled=true]
 */
export async function setAutoInit(enabled = true): Promise<void> {
  return await run(async () => {
    return await FCM.setAutoInit({ enabled });
  });
}

/**
 * check whether auto initialization is enabled
 *
 * platforms: ios, android
 *
 * @return {Boolean} enabled
 */
export async function isAutoInitEnabled(): Promise<boolean> {
  return await run(async () => {
    const { enabled } = await FCM.isAutoInitEnabled();
    return enabled;
  });
}
