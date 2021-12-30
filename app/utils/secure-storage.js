import { SecureStoragePlugin } from 'capacitor-secure-storage-plugin';
import { run } from '@ember/runloop';

/**
 * Store key/value data in secure storage
 *
 * @param {String} key
 * @param {String|Object} value - json serializable
 * @return {RSVP.Promise}
 */
export async function set(key, value) {
  try {
    return await run(async () => {
      return await SecureStoragePlugin.set({
        key,
        value: JSON.stringify(value),
      });
    });
  } catch (error) {
    console.error(error);
  }
}

/**
 * Retrieve value from key in secure storage
 *
 * @param {String} key
 * @return {RSVP.Promise<String|Object>} the deserialized value
 */
export async function get(key) {
  try {
    let encodedValue = await run(async () => {
      return await SecureStoragePlugin.get({ key });
    });
    return JSON.parse(encodedValue.value);
  } catch (e) {
    console.error(e);
    return {};
  }
}

/**
 * Clear contents from of key from secure storage.
 *
 * @param {String} key
 * @return {RSVP.Promise}
 */
export async function clear(key) {
  await run(async () => {
    try {
      await SecureStoragePlugin.remove({ key });
    } catch {
      console.warn(`SecureStorage: Unable to clear contents of key '${key}'`);
    }
  });
  return;
}

export default {
  get,
  set,
  clear,
};
