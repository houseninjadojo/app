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
 * A PaymentMethod is a credit card or other payment method that a user has
 * associated with their account. PaymentMethods can be associated with
 * Subscriptions, and can be used to pay for those Subscriptions.
 *
 * PaymentMethods are associated with Users via the inverse relationship
 * `user.paymentMethods`.
 */
export default class PaymentMethod extends Model {
  @belongsTo('subscription', { async: true, inverse: 'paymentMethod' })
  declare subscription: AsyncBelongsTo<Subscription>;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  @belongsTo('user', {
    async: true,
    inverse: 'paymentMethods',
    as: 'payment-method',
  })
  declare user: AsyncBelongsTo<User>;

  @hasMany('payments', { async: true, inverse: 'paymentMethod' })
  declare payments: AsyncHasMany<Payment>;

  @attr('date') declare createdAt: Date;
  @attr('date') declare updatedAt: Date;
}
