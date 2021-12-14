import Model, { attr, belongsTo } from '@ember-data/model';

export default class PropertyModel extends Model {
  @belongsTo('property/address', { async: false, inverse: 'property' }) address;
  @belongsTo('user') user;

  @attr('boolean') default;
  @attr('boolean') selected;
}
