import Model, { attr } from '@ember-data/model';

export default class AddressModel extends Model {
  @attr('string') street1;
  @attr('string') street2;
  @attr('string') city;
  @attr('string') state;
  @attr('string') zipcode;

  @attr('date') createdAt;
  @attr('date') updatedAt;
}
