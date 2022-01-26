import Model, { attr, hasMany } from '@ember-data/model';

export default class UserModel extends Model {
  @hasMany('devices') devices;
  @hasMany('payment-method', { polymorphic: true }) paymentMethods;
  @hasMany('property') properties;

  @attr('string') email;
  @attr('string') firstName;
  @attr('string') lastName;
  @attr('string') phoneNumber;

  // JSON Web Token for smooch.io authorization/identification
  // @see https://docs.smooch.io/guide/authenticating-users/
  @attr('string') smoochJWT;
}
