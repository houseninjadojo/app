import Model, { attr, hasMany } from '@ember-data/model';

export default class UserModel extends Model {
  @hasMany('property') properties;
  @hasMany('payment-method', { polymorphic: true }) paymentMethods;

  @attr('string') email;
  @attr('string') firstName;
  @attr('string') lastName;
  @attr('string') phoneNumber;
}
