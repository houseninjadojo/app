import Model, { attr, belongsTo } from '@ember-data/model';

export default class HomeAddressModel extends Model {
  @belongsTo('home') home;

  @attr('string') line1;
  @attr('string') line2;
  @attr('string') city;
  @attr('string') state;
  @attr('string') postal_code;
}
