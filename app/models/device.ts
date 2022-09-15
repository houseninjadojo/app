import Model, { attr, belongsTo, type AsyncBelongsTo } from '@ember-data/model';

import type User from './user';

export default class DeviceModel extends Model {
  @belongsTo('user', { async: true })
  declare user: AsyncBelongsTo<User>;

  @attr('string') declare apnsDeviceToken?: string; // apple push notification token
  @attr('string') declare fcmToken?: string; // firebase cloud messaging token

  @attr('string') declare deviceId?: string;
  @attr('string') declare name?: string;
  @attr('string') declare model?: string;
  @attr('string') declare platform?: string;
  @attr('string') declare operatingSystem?: string;
  @attr('string') declare osVersion?: string;
  @attr('string') declare manufacturer?: string;
  @attr('boolean') declare isVirtual?: boolean;
  @attr('number') declare memUsed?: number;
  @attr('number') declare diskFree?: number;
  @attr('number') declare diskTotal?: number;
  @attr('number') declare realDiskFree?: number;
  @attr('number') declare realDiskTotal?: number;
  @attr('string') declare webViewVersion?: string;

  @attr('date') declare createdAt?: Date;
  @attr('date') declare updatedAt?: Date;
}
