import { Model, belongsTo } from 'miragejs';

export default Model.extend({
  user: belongsTo('user', { inverse: 'paymentMethods' }),
  address: belongsTo('address'),
});
