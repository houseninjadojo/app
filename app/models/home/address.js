import Model, { attr, belongsTo } from '@ember-data/model';

export default class HomeAddressModel extends Model {
  @belongsTo('home', { async: false, inverse: 'address' }) home;

  @attr('string') line1;
  @attr('string') line2;
  @attr('string') city;
  @attr('string') state;
  @attr('string') postalCode;
}
