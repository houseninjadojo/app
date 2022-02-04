import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class PropertyModel extends Model {
  @belongsTo('address', { inverse: 'property' }) address;
  @belongsTo('service-area') serviceArea;
  @belongsTo('user') user;

  @hasMany('work-order') workOrders;

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
