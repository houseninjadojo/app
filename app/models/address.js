import Model, { attr, belongsTo } from '@ember-data/model';

export default class AddressModel extends Model {
  @belongsTo('addressible', { polymorphic: true }) addressible;
  // @belongsTo('property', { inverse: 'address' }) property;

  @attr('string') street1;
  @attr('string') street2;
  @attr('string') city;
  @attr('string') state;
  @attr('string') zipcode;

  @attr('date') createdAt;
  @attr('date') updatedAt;
}
