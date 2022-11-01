import BaseStore from 'ember-simple-auth/session-stores/base';
import SecureStorage from 'houseninja/utils/secure-storage';

/**
 * Session store that persists data using capacitor-secure-storage-plugin.
 * __This session store does not work with FastBoot. In order to use Ember
 * Simple Auth with FastBoot, configure the
 * {{#crossLink "CookieStore"}}{{/crossLink}} as the application's session
 * store.__
 *
 * @see https://github.com/martinkasa/capacitor-secure-storage-plugin
 * @class CapacitorSecureStorageStore
 * @module ember-simple-auth/session-stores/capacitor-secure-storage
 * @extends BaseStore
 * @public
 */
export default class CapacitorSecureStorageStore extends BaseStore {
  private lastData: object = {};

  /**
   * The `SecureStorage` key the store persists data in.
   *
   * @property key
   * @type String
   * @default 'ember_simple_auth-session'
   * @public
   */
  key = 'house-ninja-session';

  /**
   * Persists data to the secure store.
   *
   * @method persist
   * @param {Object} data The data to persist
   * @return {Promise} A promise that resolves when the data has successfully been persisted and rejects otherwise.
   * @public
   */
  async persist(data: object): Promise<{ value: boolean } | undefined> {
    this.lastData = data;
    const dataString = JSON.stringify(data || {});
    return await SecureStorage.set(this.key, dataString);
  }

  /**
   * Returns all data currently stored in the secure store as a plain object.
   *
   * @method restore
   * @return {Promise} A promise that resolves with the data currently persisted in the store when the data has been restored successfully and rejects otherwise.
   * @public
   */
  async restore(): Promise<unknown> {
    const data = await SecureStorage.get(this.key);
    return JSON.parse(data || {});
  }

  /**
   * Clears the store by deleting the
   * {{#crossLink "LocalStorageStore/key:property"}}{{/crossLink}} from the secure store.
   *
   * @method clear
   * @return {Promise} A promise that resolves when the store has been cleared successfully and rejects otherwise.
   * @public
   */
  async clear(): Promise<void> {
    this.lastData = {};
    return await SecureStorage.clear(this.key);
  }
}
