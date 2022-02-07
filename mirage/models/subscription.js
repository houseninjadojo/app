import { Model, belongsTo, hasMany } from 'miragejs';

export default Model.extend({
  paymentMethod: belongsTo('payment-method'),
  promoCode: belongsTo('promo-code'),
  subscriptionPlan: belongsTo('subscription-plan'),
  user: belongsTo('user'),
  payments: hasMany('payment'),
});
