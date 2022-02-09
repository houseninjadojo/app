import Model, { attr, hasMany } from '@ember-data/model';

export default class PromoCodeModel extends Model {
  @hasMany('invoice') invoices;
  @hasMany('subscription') subscriptions;
  @hasMany('user') users;

  @attr('boolean') active;

  @attr('string') code;
  @attr('string') name;
  @attr('string') percentOff;

  @attr('date') createdAt;
  @attr('date') updatedAt;
}
