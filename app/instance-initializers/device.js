import { getId, getInfo } from 'houseninja/utils/native/device';
import { debug } from '@ember/debug';
import { get as unstash, set as stash } from 'houseninja/utils/secure-storage';

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
  let pushToken = await unstash('pushToken');

  let deviceInfo = {
    ...info,
    ...pushToken,
    deviceId: id,
  };

  debug(`initializing device id=${id}`);

  let device = store.createRecord('device', deviceInfo);
  try {
    await device.save();
  } catch (e) {
    debug('COULD NOT SAVE DEVICE INFO ON BOOT');
    debug(e);
  }

  await stash('device', deviceInfo);
  current.set('device', device);
}

export default {
  initialize,
  after: 'notifications',
};
