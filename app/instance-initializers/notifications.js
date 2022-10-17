import {
  requestPermissions as requestRemotePermissions,
  addListener,
  register,
  // getDeliveredNotifications,
} from 'houseninja/utils/native/push-notifications';
import {
  requestPermissions as requestLocalPermissions,
  getPending as getPendingNotifications,
} from 'houseninja/utils/native/local-notifications';
import isNativePlatform from 'houseninja/utils/is-native-platform';
import { getToken } from 'houseninja/utils/native/fcm';
import {
  set as stash,
  clear as clearStash,
} from 'houseninja/utils/secure-storage';
import Sentry, { captureException } from 'houseninja/utils/sentry';
import { Intercom } from '@capacitor-community/intercom';
import { schedule } from '@ember/runloop';
import { debug } from '@ember/debug';
import { isPresent } from '@ember/utils';

/**
 * @todo
 *
 * THIS FILE IS A HOT MESS
 */

/**
 * After device registers for push notifications,
 * save the fcmToken to the device entry on our servers
 * so we can send notifications to it later.
 */
const registrationHandler = async (token) => {
  schedule('afterRender', this, async () => {
    const pushToken = {
      apnsDeviceToken: token && token.value,
      fcmToken: await getToken(),
    };
    await stash('pushToken', pushToken);
  });
};

/**
 * Register Listeners/Handlers
 */
const registerListenerHandlers = async (appInstance) => {
  let notifications = appInstance.lookup('service:notifications');
  let router = appInstance.lookup('service:router');
  // let session = appInstance.lookup('service:session');

  // successful push notification registration
  addListener('registration', registrationHandler);

  // failed push notification registration
  addListener('registrationError', async (error) => {
    schedule('afterRender', appInstance, async () => {
      captureException(error);
      await clearStash('pushToken');
    });
  });

  addListener('pushNotificationReceived', (notification) => {
    schedule('afterRender', appInstance, () => {
      notifications.add('push', 'delivered', notification);
    });
  });

  addListener('localNotificationReceived', (notification) => {
    schedule('afterRender', appInstance, () => {
      notifications.add('local', 'delivered', notification);
    });
  });

  // @todo handle clicking a notification
  addListener('pushNotificationActionPerformed', ({ notification }) => {
    schedule('afterRender', appInstance, () => {
      Sentry.addBreadcrumb({
        category: 'push-notification',
        message: 'Push Notification Action Performed',
        data: notification,
        level: 'info',
      });
      debug(
        `From Native ->  PushNotifications actionPerformed ${notification.id}`
      );
      if (notification.data.intercom_push_type === 'notification') {
        Intercom.displayMessenger();
      } else if (isPresent(notification.data.deeplink_path)) {
        router.transitionTo(notification.data.deeplink_path);
      }
    });
  });

  // addListener('tap', () => {
  //   // do nothing
  // });
};

/**
 * Initialize local notifications into Ember
 */
const initializeLocalNotifications = async (appInstance) => {
  let notifications = appInstance.lookup('service:notifications');

  // permissions check
  let localPermissionsState = await requestLocalPermissions();
  if (localPermissionsState === 'granted') {
    notifications.set('canShowLocalNotifications', true);

    // load any notifications present in notifications center
    let pendingNotifications = await getPendingNotifications();
    pendingNotifications.forEach((n) => {
      notifications.add('local', 'pending', n);
    });
  }
};

/**
 * Initialize push notifications into Ember
 */
const initializePushNotifications = async (appInstance) => {
  let notifications = appInstance.lookup('service:notifications');

  // permissions check
  let remotePermissionState = await requestRemotePermissions();
  if (remotePermissionState === 'granted') {
    // we've been granted permission, so register
    await register();

    notifications.set('canShowRemoteNotifications', true);

    // @todo
    //   currently gives an error:
    //
    //   ⚡️  To Native ->  PushNotifications getDeliveredNotifications 62185669
    //   ERROR MESSAGE:  {"errorMessage":"event capacitorDidRegisterForRemoteNotifications not called.
    //   Visit https:\/\/capacitorjs.com\/docs\/apis\/push-notifications for more information",
    //   "message":"event capacitorDidRegisterForRemoteNotifications not called.  Visit
    //   https:\/\/capacitorjs.com\/docs\/apis\/push-notifications for more information"}
    //
    // // load any notifications present in notifications center
    // let deliveredNotifications = await getDeliveredNotifications();
    // deliveredNotifications.forEach((n) => {
    //   notifications.add('push', 'delivered', n);
    // });
  }
};

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

  // setup event listeners
  await registerListenerHandlers(appInstance);

  // local setup
  await initializeLocalNotifications(appInstance);

  // remote setup
  await initializePushNotifications(appInstance);
}

export default {
  before: 'device',
  initialize,
};
