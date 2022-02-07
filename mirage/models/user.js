import { Model, hasMany, belongsTo } from 'miragejs';

export default Model.extend({
  devices: hasMany('device'),
  invoices: hasMany('invoice'),
  properties: hasMany('property'),
  paymentMethods: hasMany('payment-method', { polymorphic: true }),
  payments: hasMany('payment'),
  subscription: belongsTo('subscription'),
});
