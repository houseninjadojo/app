import Service from '@ember/service';
import {
  configure as setupLocal,
  get as getLocalStorage,
  set as setLocalStorage,
  clear as clearLocalStorage,
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
    let item = await getLocalStorage(key);
    if (item && item.expiresAt) {
      if (item.expiresAt > new Date()) {
        return item.value;
      }
    } else {
      return item;
    }
  }

  async setLocal(key, value, ttlMinutes) {
    let time = new Date();
    let item;
    if (ttlMinutes) {
      item = {
        value: value,
        expiresAt: time.setMinutes(time.getMinutes() + ttlMinutes),
      };
    } else {
      item = value;
    }
    await setLocalStorage(key, item);
  }

  async clearLocal() {
    await clearLocalStorage();
  }

  async getSecure(key) {
    return await getSecureStorage(key);
  }

  async setSecure(key, value) {
    await setSecureStorage(key, value);
  }
}
