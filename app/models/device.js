import Model, { attr, belongsTo } from '@ember-data/model';

export default class DeviceModel extends Model {
  @belongsTo('user') user;

  @attr('string') pushRegistrationId;

  @attr('string') deviceId;
  @attr('string') name;
  @attr('string') model;
  @attr('string') platform;
  @attr('string') operatingSystem;
  @attr('string') osVersion;
  @attr('string') manufacturer;
  @attr('boolean') isVirtual;
  @attr('number') memUsed;
  @attr('number') diskFree;
  @attr('number') diskTotal;
  @attr('number') realDiskFree;
  @attr('number') realDiskTotal;
  @attr('string') webViewVersion;

  @attr('date') createdAt;
  @attr('date') updatedAt;
}
