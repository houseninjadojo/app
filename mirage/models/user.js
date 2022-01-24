import { Model, hasMany } from 'miragejs';

export default Model.extend({
  devices: hasMany('devices'),
  properties: hasMany('property'),
  paymentMethods: hasMany('payment-method', { polymorphic: true }),
});
