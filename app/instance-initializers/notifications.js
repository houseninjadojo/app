// import {
//   requestPermissions as requestRemotePermissions,
//   register,
// } from 'houseninja/utils/native/push-notifications';
// import {
//   requestPermissions as requestLocalPermissions,
//   getPending as getPendingNotifications,
// } from 'houseninja/utils/native/local-notifications';
import isNativePlatform from 'houseninja/utils/is-native-platform';
// import Sentry from 'houseninja/utils/sentry';

/**
 * @todo
 *
 * THIS FILE IS A HOT MESS
 */

// /**
//  * Initialize local notifications into Ember
//  */
// const initializeLocalNotifications = async (appInstance) => {
//   let notifications = appInstance.lookup('service:notifications');

//   // permissions check
//   let localPermissionsState = await requestLocalPermissions();
//   if (localPermissionsState === 'granted') {
//     notifications.set('canShowLocalNotifications', true);

//     // load any notifications present in notifications center
//     let pendingNotifications = await getPendingNotifications();
//     pendingNotifications.forEach((n) => {
//       notifications.add('local', 'pending', n);
//     });
//   }
// };

/**
 * Initialize push notifications into Ember
 */
// const initializePushNotifications = async (appInstance) => {
//   let notifications = appInstance.lookup('service:notifications');

//   const transaction = Sentry.getCurrentHub().getScope().getTransaction();
//   let span;
//   if (transaction) {
//     span = transaction.startChild({
//       op: 'mobile.push-notification.init',
//       description: 'initializing push notification handler',
//     });
//   }

//   Sentry.addBreadcrumb({
//     type: 'info',
//     category: 'notifications.setup',
//     message: 'Initializing Push Notification Handlers',
//   });

//   // permissions check
//   let remotePermissionState = await requestRemotePermissions();
//   span?.setTag('remote-permissions', remotePermissionState);
//   span?.finish();
//   if (remotePermissionState === 'granted') {
//     // we've been granted permission, so register
//     await register();

//     notifications.set('canShowRemoteNotifications', true);
//   }
// };

/**
 * Register push notification event handlers
 *
 * @see /app/services/notifications.js
 * @see https://guides.emberjs.com/release/applications/initializers/#toc_application-instance-initializers
 */
export async function initialize(appInstance) {
  this.appInstance = appInstance;

  // if we're on the web, skip this
  if (!isNativePlatform()) {
    return;
  }

  // local setup
  // await initializeLocalNotifications(appInstance);

  // remote setup
  // await initializePushNotifications(appInstance);
}

export default {
  before: 'device',
  initialize,
};
