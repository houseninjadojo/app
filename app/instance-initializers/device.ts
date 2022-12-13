// import { getId, getInfo } from 'houseninja/utils/native/device';
// import { debug } from '@ember/debug';
// import { get as unstash, set as stash } from 'houseninja/utils/secure-storage';
// import ENV from 'houseninja/config/environment';
// import { UnauthorizedError } from '@ember-data/adapter/error';
// import { captureException } from 'houseninja/utils/sentry';
// import ApplicationInstance from '@ember/application/instance';
// import StoreService from 'houseninja/services/store';
// import CurrentService from 'houseninja/services/current';

// /**
//  * Initialize the device model
//  *
//  * @see /app/services/notifications.js
//  * @see https://guides.emberjs.com/release/applications/initializers/#toc_application-instance-initializers
//  */
// export async function initialize(
//   appInstance: ApplicationInstance
// ): Promise<void> {
//   // this breaks in tests
//   // @todo fix this
//   if (ENV.environment === 'test') {
//     return;
//   }

//   const store = appInstance.lookup('service:store') as StoreService;
//   const current = appInstance.lookup('service:current') as CurrentService;

//   const id = await getId();
//   const info = await getInfo();
//   const pushToken = await unstash('pushToken');

//   const deviceInfo = {
//     ...info,
//     ...pushToken,
//     deviceId: id,
//   };

//   debug(`[device] initializing device id=${id}`);

//   try {
//     let device;
//     // check if we know about the device already
//     const devices = await store.query('device', {
//       filter: {
//         device_id: id,
//       },
//     });
//     if (devices.length > 0) {
//       // we know about this device, so update any changes
//       device = devices.firstObject;
//       device.setProperties(deviceInfo);
//     } else {
//       // this is a new device, so create it
//       device = store.createRecord('device', deviceInfo);
//     }
//     await device.save();
//   } catch (e) {
//     if (e instanceof UnauthorizedError) {
//       debug('[device] unauthorized, skipping device registration');
//     } else {
//       captureException(e as Error);
//     }
//   }

//   await stash('device', deviceInfo);
//   current.set('device', deviceInfo);
// }

export async function initialize(): Promise<void> {
  // appInstance: ApplicationInstance
  // no-op
}

export default {
  initialize,
};
