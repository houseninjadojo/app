import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { run } from '@ember/runloop';
import { debug } from '@ember/debug';

const IMPACT_STRENGTHS = {
  heavy: ImpactStyle.Heavy,
  medium: ImpactStyle.Medium,
  light: ImpactStyle.Light,
  default: ImpactStyle.Medium,
};

const NOTIFICATION_TYPE = {
  success: NotificationType.Success,
  warning: NotificationType.Warning,
  error: NotificationType.Error,
  default: NotificationType.Success,
};

/**
 * Trigger haptic "impact" feedback
 *
 * @param {String} [strenth='default'] the impact strength
 * @return {RSVP.Promise}
 */
export async function impact(strength = 'default') {
  debug(`Haptics - impact strength='${strength}' called`);
  return run(async () => {
    return Haptics.impact({ style: IMPACT_STRENGTHS[strength] });
  });
}

/**
 * Trigger haptic "notification" feedback
 *
 * @param {String} [type='default'] notification type
 * @return {RSVP.Promise}
 */
export async function notification(type = 'default') {
  debug(`Haptics - notification type='${type}' called`);
  return run(async () => {
    return Haptics.impact({ style: NOTIFICATION_TYPE[type] });
  });
}

/**
 * Trigger haptic "vibration" feedback
 *
 * @param {Number} [duration=300] vibration duration in ms
 * @return {RSVP.Promise}
 */
export async function vibrate(duration = 300) {
  debug(`Haptics - vibrate duration=${duration} called`);
  return run(async () => {
    return Haptics.impact({ duration });
  });
}

/**
 * Trigger haptic "selection start" feedback
 *
 * @return {RSVP.Promise}
 */
export async function selectionStart() {
  debug(`Haptics - selectionStart called`);
  return run(async () => {
    return Haptics.selectionStart();
  });
}

/**
 * Trigger haptic "selection changed" feedback
 *
 * @return {RSVP.Promise}
 */
export async function selectionChanged() {
  debug(`Haptics - selectionStart called`);
  return run(async () => {
    return Haptics.selectionStart();
  });
}

/**
 * Trigger haptic "selection end" feedback
 *
 * @return {RSVP.Promise}
 */
export async function selectionEnd() {
  debug(`Haptics - selectionStart called`);
  return run(async () => {
    return Haptics.selectionStart();
  });
}
