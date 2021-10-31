import { Capacitor } from '@capacitor/core';

/**
 * Return the running platform. One of:
 * `web`, `ios`, `android`
 * @method getPlatform
 * @return String
 */
export default function getPlatform() {
  return Capacitor.getPlatform();
}
