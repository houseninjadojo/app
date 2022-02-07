import Model, { attr, hasMany, belongsTo } from '@ember-data/model';

export default class UserModel extends Model {
  @hasMany('device') devices;
  @hasMany('invoice') invoices;
  @hasMany('payment-method', { polymorphic: true }) paymentMethods;
  @hasMany('payment') payments;
  @hasMany('property') properties;
  @belongsTo('subscription') subscription;

  @attr('string') email;
  @attr('string') firstName;
  @attr('string') lastName;
  @attr('string') phoneNumber;

  @attr('string') requestedZipcode;
  @attr('write-only') password;

  @attr('date') createdAt;
  @attr('date') updatedAt;
}
