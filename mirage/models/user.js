import { Model, hasMany, belongsTo } from 'miragejs';

export default Model.extend({
  devices: hasMany('devices'),
  properties: hasMany('property'),
  paymentMethods: hasMany('payment-method', { polymorphic: true }),
  subscription: belongsTo('subscription'),
});
