import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

/**
 * Generic Parent Class for payment models
 *
 * @see app/models/payment-method/card
 */
export default class PaymentMethodModel extends Model {
  @belongsTo('subscription') subscription;
  @belongsTo('user', { inverse: 'paymentMethods' }) user;
  @hasMany('payments', { inverse: 'paymentMethod' }) payments;

  @attr('date') createdAt;
  @attr('date') updatedAt;
}
