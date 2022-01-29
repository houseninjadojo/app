import Model, { attr, belongsTo } from '@ember-data/model';

/**
 * Generic Parent Class for payment models
 *
 * @see app/models/payment-method/card
 */
export default class PaymentMethodModel extends Model {
  @belongsTo('user', { inverse: 'paymentMethods' }) user;
  @belongsTo('address') billingAddress;

  @attr('date') createdAt;
  @attr('date') updatedAt;
}
