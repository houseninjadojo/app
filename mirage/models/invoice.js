import { Model, belongsTo, hasMany } from 'miragejs';

export default Model.extend({
  document: belongsTo('document'),
  payment: belongsTo('payment'),
  promoCode: belongsTo('promo-code'),
  subscription: belongsTo('subscription'),
  user: belongsTo('user'),
  lineItems: hasMany('line-item'),
});
