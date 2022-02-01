import { Device } from '@capacitor/device';
import { run } from '@ember/runloop';
// import { task } from 'ember-concurrency';

/**
 * @see https://capacitorjs.com/docs/apis/device#getid
 *
 * Return an unique identifier for the device.
 *
 * @return {Promise<String>} uuid
 */
export async function getId() {
  return await run(async () => {
    let result = await Device.getId();
    return result.uuid;
  });
}

/**
 * @see https://capacitorjs.com/docs/apis/device#getinfo
 *
 * Return information about the underlying device/os/platform.
 *
 * @return {Promise<Object>} DeviceInfo
 * @return {String} DeviceInfo.name - The name of the device. For example, “John’s iPhone”. This is
 *   only supported on iOS and Android 7.1 or above.
 * @return {String} DeviceInfo.model - The device model. For example, “iPhone”.
 * @return {String} DeviceInfo.platform - 'ios' | 'android' | 'web'
 * @return {String} DeviceInfo.operatingSystem - 'ios' | 'android' | 'windows' | 'mac' | 'unknown'
 * @return {String} DeviceInfo.osVersion - The version of the device OS.
 * @return {String} DeviceInfo.manufacturer - The manufacturer of the device.
 * @return {Boolean} DeviceInfo.isVirtual - Whether the app is running in a simulator/emulator.
 * @return {Number} DeviceInfo.memUsed - Approximate memory used by the current app, in bytes. Divide
 *   by 1048576 to get the number of MBs used.
 * @return {Number} DeviceInfo.diskFree - How much free disk space is available on the the normal data
 *   storage path for the os, in bytes. On Android it returns the free disk space on the “system” partition
 *   holding the core Android OS. On iOS this value is not accurate.
 * @return {Number} DeviceInfo.diskTotal - The total size of the normal data storage path for the OS, in
 *   bytes. On Android it returns the disk space on the “system” partition holding the core Android OS.
 * @return {Number} DeviceInfo.realDiskFree - How much free disk space is available on the the normal data
 *   storage, in bytes.
 * @return {Number} DeviceInfo.realDiskTotal - The total size of the normal data storage path, in bytes.
 * @return {String} DeviceInfo.webViewVersion - The web view browser version
 */
export async function getInfo() {
  return await run(async () => {
    return await Device.getInfo();
  });
}

/**
 * @see https://capacitorjs.com/docs/apis/device#getbatteryinfo
 *
 * Return information about the battery.
 *
 * @return {Promise<Object>} BatteryInfo
 * @return {Number} BatteryInfo.batteryLevel - A percentage (0 to 1) indicating how much the battery is charged.
 * @return {Boolean} BatteryInfo.isCharging - Whether the device is charging.
 */
export async function getBatteryInfo() {
  return await run(async () => {
    return await Device.getBatteryInfo();
  });
}
