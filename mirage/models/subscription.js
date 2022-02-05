import { Model, belongsTo } from 'miragejs';

export default Model.extend({
  paymentMethod: belongsTo('payment-method'),
  subscriptionPlan: belongsTo('subscription-plan'),
  user: belongsTo('user'),
});
