import Model, { AsyncHasMany, attr, hasMany } from '@ember-data/model';

import type Subscription from './subscription';

export default class SubscriptionPlanModel extends Model {
  @hasMany('subscription', { async: true })
  declare subscriptions: AsyncHasMany<Subscription>;

  @attr('string') declare slug: string;
  @attr('string') declare name: string;
  @attr('number') declare price: number;
  @attr('string') declare interval: string;
  @attr('string') declare perk?: string;

  @attr('date') declare createdAt: Date;
  @attr('date') declare updatedAt: Date;
}
