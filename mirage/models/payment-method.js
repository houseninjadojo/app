import { Model, belongsTo, hasMany } from 'miragejs';

export default Model.extend({
  payments: hasMany('payment', { inverse: 'paymentMethod' }),
  subscription: belongsTo('subscription'),
  user: belongsTo('user', { inverse: 'paymentMethods' }),
});
