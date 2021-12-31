import { getId, getInfo } from 'houseninja/utils/native/device';
import { debug } from '@ember/debug';

/**
 * Initialize the device model
 *
 * @see /app/services/notifications.js
 * @see https://guides.emberjs.com/release/applications/initializers/#toc_application-instance-initializers
 */
export async function initialize(appInstance) {
  let store = appInstance.lookup('service:store');
  let current = appInstance.lookup('service:current');

  let id = await getId();
  let info = await getInfo();

  let deviceInfo = {
    ...info,
    deviceId: id,
  };

  debug(`initializing device id=${id}`);
  debug(deviceInfo);

  let device = await store.createRecord('device', deviceInfo);
  current.set('device', device);
}

export default {
  initialize,
};
