import Model, { attr, hasMany } from '@ember-data/model';

export default class UserModel extends Model {
  @hasMany('device') devices;
  @hasMany('payment-method', { polymorphic: true }) paymentMethods;
  @hasMany('property') properties;

  @attr('string') email;
  @attr('string') firstName;
  @attr('string') lastName;
  @attr('string') phoneNumber;

  @attr('string') requestedZipcode;
  @attr('write-only') password;

  @attr('date') createdAt;
  @attr('date') updatedAt;

  // An HMAC signed hash of the user id.
  // Required for Intercom Identify Verification
  // @see https://developers.intercom.com/installing-intercom/docs/cordova-phonegap-identity-verification
  @attr('string') intercomHash;
}
