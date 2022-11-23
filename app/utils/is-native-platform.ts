import { Capacitor } from '@capacitor/core';
import { run } from '@ember/runloop';

/**
 * Are we running on Mobile?
 * @method isNativePlatform
 * @return Bool
 */
export default function isNativePlatform(): boolean {
  const val: boolean = run(Capacitor, 'isNativePlatform');
  return val;
}
