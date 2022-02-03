import { getId, getInfo } from 'houseninja/utils/native/device';
import { debug } from '@ember/debug';
import { get as unstash, set as stash } from 'houseninja/utils/secure-storage';
import ENV from 'houseninja/config/environment';

/**
 * Initialize the device model
 *
 * @see /app/services/notifications.js
 * @see https://guides.emberjs.com/release/applications/initializers/#toc_application-instance-initializers
 */
export async function initialize(appInstance) {
  // this breaks in tests
  // @todo fix this
  if (ENV.environment === 'test') {
    return;
  }

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

  try {
    let device;
    let devices = await store.query('device', {
      filter: {
        deviceId: id,
      },
    });
    if (devices.length > 0) {
      device = devices.firstObject();
      device.setProperties(deviceInfo);
    } else {
      device = store.createRecord('device', deviceInfo);
    }
    await device.save();
  } catch (e) {
    debug('COULD NOT SAVE DEVICE INFO ON BOOT');
    debug(e);
  }

  await stash('device', deviceInfo);
  current.set('device', deviceInfo);
}

export default {
  initialize,
  after: 'notifications',
};
