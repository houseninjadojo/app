import Service from '@ember/service';
import {
  configure as setupLocal,
  get as getLocalStorage,
  set as setLocalStorage,
} from 'houseninja/utils/native/local-storage';
import {
  get as getSecureStorage,
  set as setSecureStorage,
} from 'houseninja/utils/secure-storage';

export default class StorageService extends Service {
  async setup() {
    await setupLocal();
  }

  async getLocal(key) {
    return await getLocalStorage(key);
  }

  async setLocal(key, value) {
    await setLocalStorage(key, value);
  }

  async getSecure(key) {
    return await getSecureStorage(key);
  }

  async setSecure(key, value) {
    await setSecureStorage(key, value);
  }
}
