import Model, {
  AsyncBelongsTo,
  AsyncHasMany,
  attr,
  belongsTo,
  hasMany,
} from '@ember-data/model';

import type Payment from './payment';
import type Subscription from './subscription';
import type User from './user';

/**
 * Generic Parent Class for payment models
 *
 * @see app/models/payment-method/card
 */
export default class PaymentMethodModel extends Model {
  @belongsTo('subscription', { async: true, inverse: 'paymentMethod' })
  declare subscription: AsyncBelongsTo<Subscription>;

  @belongsTo('user', { async: true, inverse: 'paymentMethods' })
  declare user: AsyncBelongsTo<User>;

  @hasMany('payments', { async: true, inverse: 'paymentMethod' })
  declare payments: AsyncHasMany<Payment>;

  @attr('date') declare createdAt: Date;
  @attr('date') declare updatedAt: Date;
}
