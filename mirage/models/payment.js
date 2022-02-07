import { Model, belongsTo } from 'miragejs';

export default Model.extend({
  invoice: belongsTo('invoice'),
  paymentMethod: belongsTo('payment-method', { inverse: 'payments' }),
  user: belongsTo('user'),
});
