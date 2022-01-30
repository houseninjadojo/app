import Model, { attr } from '@ember-data/model';

export default class SubscriptionPlanModel extends Model {
  @attr('string') slug;
  @attr('string') name;
  @attr('number') price;
  @attr('string') interval;
  @attr('string') perk;

  @attr('date') createdAt;
  @attr('date') updatedAt;
}
