import { getId, getInfo } from 'houseninja/utils/native/device';
import { debug } from '@ember/debug';
import { get as unstash, set as stash } from 'houseninja/utils/secure-storage';

import ENV from 'houseninja/config/environment';
import type ApplicationInstance from '@ember/application/instance';
import type StoreService from '@ember-data/store';
import CurrentService from 'houseninja/services/current';

type PushToken =
  | {
      apnsDeviceToken?: string;
      fcmToken?: string;
    }
  | undefined;

/**
 * Initialize the device model
 *
 * @see /app/services/notifications.js
 * @see https://guides.emberjs.com/release/applications/initializers/#toc_application-instance-initializers
 */
export async function initialize(appInstance: ApplicationInstance) {
  // this breaks in tests
  // @todo fix this
  if (ENV.environment === 'test') {
    return;
  }

  const store = appInstance.lookup('service:store') as StoreService;
  const current = appInstance.lookup('service:current') as CurrentService;

  const id = await getId();
  const info = await getInfo();
  const pushToken = (await unstash('pushToken')) as PushToken;

  const deviceInfo = {
    ...info,
    ...pushToken,
    deviceId: id,
  };

  debug(`initializing device id=${id}`);

  try {
    let device;
    // check if we know about the device already
    const devices = await store.query('device', {
      filter: {
        device_id: id,
      },
    });
    if (devices.length > 0) {
      // we know about this device, so update any changes
      device = devices.firstObject;
      device.setProperties(deviceInfo);
    } else {
      // this is a new device, so create it
      device = store.createRecord('device', deviceInfo);
    }
    await device.save();
  } catch (e) {
    debug('COULD NOT SAVE DEVICE INFO ON BOOT');
    debug(e as string);
  }

  await stash('device', deviceInfo);
  current.set('device', deviceInfo);
}

export default {
  initialize,
  after: 'notifications',
};
