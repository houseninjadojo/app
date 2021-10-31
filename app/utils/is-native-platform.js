import { Capacitor } from '@capacitor/core';

/**
 * Are we running on Mobile?
 * @method isNativePlatform
 * @return Bool
 */
export default function isNativePlatform() {
  return Capacitor.isNativePlatform();
}
