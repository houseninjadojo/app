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
import Sentry from 'houseninja/utils/sentry';
import { service } from '@ember/service';

type JSONSerializable =
  | string
  | number
  | boolean
  | null
  | undefined
  | JSONSerializable[]
  | { [key: string]: JSONSerializable };
type LocalValueObject = { value?: JSONSerializable; expiresAt?: number };

const addMinToCurrentEpoch = (minutes: number): number => {
  return new Date(Date.now() + minutes * 60000).getTime();
};

export default class StorageService extends Service {
  @service declare fastboot: any;

  async setup() {
    Sentry.addBreadcrumb({
      category: 'storage.setup',
      message: 'setting up',
    });
    await setupLocal();
  }

  async getLocal(key: string): Promise<JSONSerializable | undefined> {
    const item = await getLocalStorage(key);
    const { value, expiresAt }: LocalValueObject = Object.assign(
      {
        value: undefined,
        expiresAt: 0,
      },
      item
    );
    if (expiresAt === 0 || expiresAt > Date.now()) {
      return value;
    }
  }

  // eslint-disable-next-line prettier/prettier, @typescript-eslint/no-explicit-any
  async setLocal(key: string, value: any, ttlMinutes = 0): Promise<void> {
    const expiresAt = ttlMinutes > 0 ? addMinToCurrentEpoch(ttlMinutes) : 0;
    const item: JSONSerializable = {
      value,
      expiresAt,
    };
    if (this.fastboot.isFastBoot) return;
    await setLocalStorage(key, item);
  }

  async clearLocal(): Promise<void> {
    await clearLocalStorage();
  }

  async getSecure(key: string): Promise<JSONSerializable | undefined> {
    return await getSecureStorage(key);
  }

  async setSecure(key: string, value: JSONSerializable): Promise<void> {
    await setSecureStorage(key, value);
  }
}
