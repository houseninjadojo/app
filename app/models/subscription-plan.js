import Model, { attr, hasMany } from '@ember-data/model';

export default class SubscriptionPlanModel extends Model {
  @hasMany('subscription') subscriptions;

  @attr('string') slug;
  @attr('string') name;
  @attr('number') price;
  @attr('string') interval;
  @attr('string') perk;

  @attr('date') createdAt;
  @attr('date') updatedAt;
}
