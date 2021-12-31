import {
  requestPermissions as requestRemotePermissions,
  addListener,
  register,
  getDeliveredNotifications,
} from 'houseninja/utils/native/push-notifications';
import {
  requestPermissions as requestLocalPermissions,
  getPending as getPendingNotifications,
} from 'houseninja/utils/native/local-notifications';
import isNativePlatform from 'houseninja/utils/is-native-platform';

/**
 * Register push notification event handlers
 *
 * @see /app/services/notifications.js
 * @see https://guides.emberjs.com/release/applications/initializers/#toc_application-instance-initializers
 */
export async function initialize(appInstance) {
  // if we're on early, skip this
  if (!isNativePlatform()) {
    return;
  }

  let notifications = appInstance.lookup('service:notifications');
  // let store = appInstance.lookup('service:store');
  let current = appInstance.lookup('service:current');

  // successful push notification registration
  addListener('registration', (token) => {
    current.device.set('pushNotificationId', token);
    current.device.save();
  });

  // failed push notification registration
  addListener('registrationError', (error) => {
    console.error(error);
  });

  addListener('pushNotificationReceived', (notification) => {
    notifications.add('pushed', 'delivered', notification);
  });

  addListener('localNotificationReceived', (notification) => {
    notifications.add('local', 'delivered', notification);
  });

  // permissions check
  // @todo this whole thing is ugly
  let localPermissionsState = await requestLocalPermissions();
  if (localPermissionsState === 'granted') {
    notifications.set('canShowLocalNotifications', true);
    let pendingNotifications = await getPendingNotifications();
    pendingNotifications.forEach((n) => {
      notifications.add('local', 'pending', n);
    });
  }
  let remotePermissionState = await requestRemotePermissions();
  if (remotePermissionState === 'granted') {
    notifications.set('canShowRemoteNotifications', true);
    let deliveredNotifications = await getDeliveredNotifications();
    deliveredNotifications.forEach((n) => {
      notifications.add('push', 'delivered', n);
    });
    await register();
  }
}

export default {
  after: 'device',
  initialize,
};
