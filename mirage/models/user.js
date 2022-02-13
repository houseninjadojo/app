import { Model, hasMany, belongsTo } from 'miragejs';

export default Model.extend({
  documents: hasMany('document'),
  devices: hasMany('device'),
  invoices: hasMany('invoice'),
  properties: hasMany('property'),
  paymentMethods: hasMany('payment-method', { polymorphic: true }),
  payments: hasMany('payment'),
  promoCode: belongsTo('promo-code'),
  subscription: belongsTo('subscription'),
});
