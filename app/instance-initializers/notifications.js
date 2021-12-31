// import { requestPermissions } from 'houseninja/utils/native/push-notifications';

/**
 * Register push notification event handlers
 *
 * @see /app/services/notifications.js
 * @see https://guides.emberjs.com/release/applications/initializers/#toc_application-instance-initializers
 */
export async function initialize(appInstance) {
  appInstance.lookup('service:notifications');
}

export default {
  initialize,
};
