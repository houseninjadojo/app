import Service from '@ember/service';
// import * as FS from '@fullstory/browser';
// import { UXCam } from '@capacitor-community/uxcam';
// import UXCam from 'cordova-uxcam';
import ENV from 'houseninja/config/environment';

export default class UxcamService extends Service {
  async getPermission() {
    return await window.UXCam.optIntoSchematicRecordings();
  }

  async setUserIdentity(userIdentity) {
    return await window.UXCam.setUserIdentity(userIdentity);
  }

  async setup() {
    window.UXCam.startWithKey(ENV.uxcam.appKey);
  }

  async tagScreenName(name) {
    return await window.UXCam.tagScreenName(name);
  }
}
