import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class PropertyModel extends Model {
  @belongsTo('service-area') serviceArea;
  @belongsTo('user') user;

  @hasMany('document') documents;
  @hasMany('work-order') workOrders;

  @attr('string') streetAddress1;
  @attr('string') streetAddress2;
  @attr('string') city;
  @attr('string') state;
  @attr('string') zipcode;

  @attr('number') lotSize;
  @attr('number') homeSize;
  @attr('number') garageSize;
  @attr('number') yearBuilt;
  @attr('string') estimatedValue;
  @attr('number') bedrooms;
  @attr('number') bathrooms;
  @attr('number') pools;

  @attr('boolean') default;
  @attr('boolean') selected;

  @attr('date') createdAt;
  @attr('date') updatedAt;
}
