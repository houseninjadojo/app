import { SecureStoragePlugin } from 'capacitor-secure-storage-plugin';
import { run } from '@ember/runloop';
import { debug } from '@ember/debug';

type JSONSerializable =
  | string
  | number
  | boolean
  | null
  | undefined
  | JSONSerializable[]
  | { [key: string]: JSONSerializable };

type SetResult = Promise<{ value: boolean } | undefined>;

/**
 * Store key/value data in secure storage
 *
 * @param {String} key
 * @param {String|Object} value - json serializable
 * @return {RSVP.Promise}
 */
export async function set(key: string, value: JSONSerializable): SetResult {
  try {
    return await run(async (): Promise<{ value: boolean }> => {
      return await SecureStoragePlugin.set({
        key,
        value: JSON.stringify(value),
      });
    });
  } catch (e) {
    debug(`[storage] ${e as string}`);
  }
}

/**
 * Retrieve value from key in secure storage
 *
 * @param {String} key
 * @return {RSVP.Promise<String|Object>} the deserialized value
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function get(key: string): Promise<any> {
  try {
    const encodedValue = await run(async () => {
      return await SecureStoragePlugin.get({ key });
    });
    return JSON.parse(encodedValue.value);
  } catch (e) {
    debug(`[storage] ${e as string}`);
    return {};
  }
}

/**
 * Clear contents from of key from secure storage.
 *
 * @param {String} key
 * @return {RSVP.Promise}
 */
export async function clear(key: string): Promise<void> {
  await run(async () => {
    try {
      await SecureStoragePlugin.remove({ key });
    } catch {
      debug(
        `[storage] SecureStorage: Unable to clear contents of key '${key}'`
      );
    }
  });
  return;
}

export default {
  get,
  set,
  clear,
};
