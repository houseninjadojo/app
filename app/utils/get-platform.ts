import { Capacitor } from '@capacitor/core';
import { run } from '@ember/runloop';

type Platform = 'web' | 'ios' | 'android';

/**
 * Return the running platform. One of:
 * `web`, `ios`, `android`
 * @method getPlatform
 * @return String
 */
export default function getPlatform(): Platform {
  return run(Capacitor, 'getPlatform') as Platform;
}
