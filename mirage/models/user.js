import { Model, hasMany } from 'ember-cli-mirage';

export default Model.extend({
  devices: hasMany('devices'),
  properties: hasMany('property'),
  paymentMethods: hasMany('payment-method', { polymorphic: true }),
});
