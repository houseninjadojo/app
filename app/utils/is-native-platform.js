import { Capacitor } from '@capacitor/core';
import { run } from '@ember/runloop';
import { debug } from '@ember/debug';

/**
 * Are we running on Mobile?
 * @method isNativePlatform
 * @return Bool
 */
export default function isNativePlatform() {
  const val = run(Capacitor, 'isNativePlatform');
  debug(`isNativePlatform() - ${val}`);
  return val;
}
