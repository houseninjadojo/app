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

export default class SubscriptionModel extends Model {
  @belongsTo('credit-card', { async: true })
  declare paymentMethod: AsyncBelongsTo<CreditCard>;

  @belongsTo('promo-code', { async: true })
  declare promoCode: AsyncBelongsTo<PromoCode>;

  @belongsTo('subscription-plan', { async: true })
  declare subscriptionPlan: AsyncBelongsTo<SubscriptionPlan>;

  @belongsTo('user', { async: true })
  declare user: AsyncBelongsTo<User>;

  @hasMany('invoice', { async: true })
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
