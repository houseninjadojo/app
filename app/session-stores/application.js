import CapacitorSecureStorageStore from './secure-storage';

/**
 * Use CapacitorSecureStorageStore for our Application Session storage
 * This will use KeyChain in iOS, AndroidKeyStore in Android, and LocalStorage w/ base64 encoding on web
 *
 * @see /app/session-stores/secure-storage.js
 * @see https://github.com/martinkasa/capacitor-secure-storage-plugin#readme
 */
export default class ApplicationSessionStore extends CapacitorSecureStorageStore {
  // Key used to save/fetch session data
  key = 'houseninja-session';

  // Endpoint for token auth
  serverTokenEndpoint = 'https://api.houseninja.co/oauth/token';

  // Endpoint for token revocation
  serverTokenRevocationEndpoint = 'https://api.houseninja.co/oauth/revoke';
}
