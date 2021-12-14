import Model, { attr, belongsTo } from '@ember-data/model';

export default class PropertyAddressModel extends Model {
  @belongsTo('property', { async: false, inverse: 'address' }) property;

  @attr('string') line1;
  @attr('string') line2;
  @attr('string') city;
  @attr('string') state;
  @attr('string') postalCode;
}
