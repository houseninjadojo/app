import { Storage } from '@capacitor/storage';
import { run } from '@ember/runloop';

export const GROUPNAME = 'houseninja';

/**
 * @see https://capacitorjs.com/docs/apis/storage#configure
 *
 * Configure the storage plugin at runtime.
 *
 * @param {Object} [options]
 * @param {String} [options.group='houseninja']
 *  Set the storage group. Storage groups are used to organize key/value pairs.
 * @return {Promise<void>}
 */
export async function configure(options = { group: GROUPNAME }) {
  return await run(async () => {
    return Storage.configure(options);
  });
}

/**
 * @see https://capacitorjs.com/docs/apis/storage#get
 *
 * Get the value from storage of a given key.
 *
 * @param {Object} options
 * @param {String} options.key
 * @return {Promise<{ value: String }>}
 */
export async function get(options) {
  return await run(async () => {
    return await Storage.get(options);
  });
}

/**
 * @see https://capacitorjs.com/docs/apis/storage#set
 *
 * Set the value in storage of a given key.
 *
 * @param {Object} options
 * @param {String} options.key
 * @param {String} options.value
 * @return {Promise<{ value: String }>}
 */
export async function set(options) {
  return await run(async () => {
    return await Storage.get(options);
  });
}

/**
 * @see https://capacitorjs.com/docs/apis/storage#remove
 *
 * Remove the value from storage for a given key, if any.
 *
 * @param {Object} options
 * @param {String} options.key
 * @return {Promise<void>}
 */
export async function remove(options) {
  return await run(async () => {
    return await Storage.remove(options);
  });
}

/**
 * @see https://capacitorjs.com/docs/apis/storage#clear
 *
 * Clear keys and values from storage.
 *
 * @return {Promise<void>}
 */
export async function clear() {
  return await run(async () => {
    return await Storage.clear();
  });
}

/**
 * @see https://capacitorjs.com/docs/apis/storage#keys
 *
 * Return the list of known keys in storage.
 *
 * @return {Promise<{ keys: String[] }>}
 */
export async function keys() {
  return await run(async () => {
    return await Storage.keys();
  });
}
