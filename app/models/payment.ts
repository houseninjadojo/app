import Model, { AsyncBelongsTo, attr, belongsTo } from '@ember-data/model';

import type Invoice from './invoice';
import type PaymentMethod from './payment-method';
import type User from './user';

export default class PaymentModel extends Model {
  @belongsTo('invoice', { async: true, inverse: 'payment' })
  declare invoice: AsyncBelongsTo<Invoice>;

  @belongsTo('payment-method', {
    async: true,
    polymorphic: true,
    inverse: 'payments',
  })
  declare paymentMethod: AsyncBelongsTo<PaymentMethod>;

  @belongsTo('user', { async: true, inverse: 'payments' })
  declare user: AsyncBelongsTo<User>;

  @attr('string') declare amount: string;
  @attr('string') declare description?: string;
  @attr('string') declare statementDescriptor?: string;
  @attr('string') declare status: string;

  @attr('boolean') declare refunded: boolean;
  @attr('boolean') declare paid: boolean;

  @attr('date') declare createdAt: Date;
  @attr('date') declare updatedAt: Date;
}
