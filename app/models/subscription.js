import Model, { attr, belongsTo } from '@ember-data/model';

export default class SubscriptionModel extends Model {
  @belongsTo('payment-method') paymentMethod;
  @belongsTo('subscription-plan') subscriptionPlan;
  @belongsTo('user') user;

  @attr('string') status;

  @attr('date') canceledAt;
  @attr('date') trialStart;
  @attr('date') trialEnd;
  @attr('date') currentPeriodStart;
  @attr('date') currentPeriodEnd;

  @attr('date') createdAt;
  @attr('date') updatedAt;
}
