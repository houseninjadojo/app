import {
  requestPermissions,
  addListener,
  register,
} from 'houseninja/utils/native/push-notifications';
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

  // permissions check
  let permissionState = await requestPermissions();
  if (permissionState === 'granted') {
    await register();
    notifications.set('canShowNotifications', true);
  }
}

export default {
  after: 'device',
  initialize,
};
