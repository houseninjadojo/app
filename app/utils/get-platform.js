import { Capacitor } from '@capacitor/core';
import { run } from '@ember/runloop';
import { debug } from '@ember/debug';

/**
 * Return the running platform. One of:
 * `web`, `ios`, `android`
 * @method getPlatform
 * @return String
 */
export default function getPlatform() {
  const val = run(Capacitor, 'getPlatform');
  debug(`getPlatform() - ${val}`);
  return val;
}
