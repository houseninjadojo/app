import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class SubscriptionModel extends Model {
  @belongsTo('credit-card') paymentMethod;
  @belongsTo('subscription-plan') subscriptionPlan;
  @belongsTo('user') user;
  @hasMany('invoice') invoices;

  @attr('string') status;

  @attr('date') canceledAt;
  @attr('date') trialStart;
  @attr('date') trialEnd;
  @attr('date') currentPeriodStart;
  @attr('date') currentPeriodEnd;

  @attr('date') createdAt;
  @attr('date') updatedAt;
}
