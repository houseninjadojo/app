import { LocalNotifications } from '@capacitor/local-notifications';
import { run } from '@ember/runloop';
import { debug } from '@ember/debug';

/**
 * Schedule one or more local notifications.
 *
 * @param {Object} options - ScheduleOptions
 * @param {Array<Object>} [options.notifications] LocalNotificationSchema[]
 */
export async function schedule(options) {
  return await run(async () => {
    return await LocalNotifications.schedule(options);
  });
}
