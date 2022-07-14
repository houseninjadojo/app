import { Model, belongsTo, hasMany } from 'miragejs';

export default Model.extend({
  document: belongsTo('document'),
  receipt: belongsTo('document'),
  payment: belongsTo('payment'),
  promoCode: belongsTo('promo-code'),
  subscription: belongsTo('subscription'),
  user: belongsTo('user'),
  workOrder: belongsTo('work-order'),
  lineItems: hasMany('line-item'),
});
