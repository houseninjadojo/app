import Model, { attr, belongsTo } from '@ember-data/model';

export default class PaymentModel extends Model {
  @belongsTo('invoice') invoice;
  @belongsTo('payment-method', { inverse: 'payment' }) paymentMethod;
  @belongsTo('user') user;

  @attr('string') amount;
  @attr('string') description;
  @attr('string') statementDesciptor;
  @attr('string') status;

  @attr('boolean') refunded;
  @attr('boolean') paid;

  @attr('date') createdAt;
  @attr('date') updatedAt;
}
