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
import { isPresent } from '@ember/utils';

type JSONSerializable =
  | string
  | number
  | boolean
  | null
  | undefined
  | JSONSerializable[]
  | { [key: string]: JSONSerializable };

export default class StorageService extends Service {
  async setup() {
    await setupLocal();
  }

  async getLocal(key: string) {
    const currentTimestamp = new Date();
    const item = (await getLocalStorage(key)) ?? {};
    const expiresAt: Date | undefined = isPresent(item['expiresAt'])
      ? new Date(item['expiresAt'] as string)
      : undefined;
    if (isPresent(expiresAt)) {
      if ((expiresAt as Date) > currentTimestamp) {
        return item['value'];
      }
    } else {
      return item;
    }
  }

  async setLocal(
    key: string,
    value: JSONSerializable,
    ttlMinutes: number
  ): Promise<void> {
    const time = new Date();
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

  async getSecure(key: string): Promise<JSONSerializable | undefined> {
    return await getSecureStorage(key);
  }

  async setSecure(key: string, value: JSONSerializable): Promise<void> {
    await setSecureStorage(key, value);
  }
}
