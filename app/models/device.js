import Model, { attr, belongsTo } from '@ember-data/model';

export default class DeviceModel extends Model {
  @belongsTo('user') user;

  @attr('string') deviceId;
}
