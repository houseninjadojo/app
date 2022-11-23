import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { run } from '@ember/runloop';
import { debug } from '@ember/debug';

export { ImpactStyle, NotificationType };

/**
 * Trigger haptic "impact" feedback
 *
 * @param {ImpactStyle} [strenth=ImpactStyle.Medium] the impact strength
 * @return {RSVP.Promise}
 */
// eslint-disable-next-line prettier/prettier
export async function impact(strength: ImpactStyle = ImpactStyle.Medium): Promise<void> {
  debug(`Haptics - impact strength='${strength}' called`);
  return await run(async () => {
    return await Haptics.impact({ style: strength });
  });
}

/**
 * Trigger haptic "notification" feedback
 *
 * @param {NotificationType} [type=NotificationType.Success] notification type
 * @return {RSVP.Promise}
 */
// eslint-disable-next-line max-len, prettier/prettier
export async function notification(type: NotificationType = NotificationType.Success): Promise<void> {
  debug(`Haptics - notification type='${type}' called`);
  return await run(async () => {
    return await Haptics.notification({ type });
  });
}

/**
 * Trigger haptic "vibration" feedback
 *
 * @param {Number} [duration=300] vibration duration in ms
 * @return {RSVP.Promise}
 */
export async function vibrate(duration = 300): Promise<void> {
  debug(`Haptics - vibrate duration=${duration} called`);
  return await run(async () => {
    return await Haptics.vibrate({ duration });
  });
}

/**
 * Trigger haptic "selection start" feedback
 *
 * @return {RSVP.Promise}
 */
export async function selectionStart(): Promise<void> {
  debug(`Haptics - selectionStart called`);
  return await run(async () => {
    return await Haptics.selectionStart();
  });
}

/**
 * Trigger haptic "selection changed" feedback
 *
 * @return {RSVP.Promise}
 */
export async function selectionChanged(): Promise<void> {
  debug(`Haptics - selectionStart called`);
  return await run(async () => {
    return await Haptics.selectionStart();
  });
}

/**
 * Trigger haptic "selection end" feedback
 *
 * @return {RSVP.Promise}
 */
export async function selectionEnd(): Promise<void> {
  debug(`Haptics - selectionStart called`);
  return await run(async () => {
    return await Haptics.selectionStart();
  });
}
