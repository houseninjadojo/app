import Model, {
  AsyncBelongsTo,
  AsyncHasMany,
  attr,
  belongsTo,
  hasMany,
} from '@ember-data/model';

import type CreditCard from './credit-card';
import type Invoice from './invoice';
import type PromoCode from './promo-code';
import type SubscriptionPlan from './subscription-plan';
import type User from './user';

export default class Subscription extends Model {
  @belongsTo('credit-card', { async: true, inverse: 'subscriptions' })
  declare paymentMethod: AsyncBelongsTo<CreditCard>;

  @belongsTo('promo-code', { async: true, inverse: 'subscriptions' })
  declare promoCode: AsyncBelongsTo<PromoCode>;

  @belongsTo('subscription-plan', { async: true, inverse: 'subscriptions' })
  declare subscriptionPlan: AsyncBelongsTo<SubscriptionPlan>;

  @belongsTo('user', { async: true, inverse: 'subscription' })
  declare user: AsyncBelongsTo<User>;

  @hasMany('invoice', { async: true, inverse: 'subscription' })
  declare invoices: AsyncHasMany<Invoice>;

  @attr('string') declare status: string;

  @attr('date') declare canceledAt?: Date;
  @attr('date') declare trialStart?: Date;
  @attr('date') declare trialEnd?: Date;
  @attr('date') declare currentPeriodStart: Date;
  @attr('date') declare currentPeriodEnd: Date;

  @attr('date') declare createdAt: Date;
  @attr('date') declare updatedAt: Date;
}
