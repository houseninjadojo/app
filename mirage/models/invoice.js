import { Model, belongsTo } from 'miragejs';

export default Model.extend({
  payment: belongsTo('payment'),
  subscription: belongsTo('subscription'),
  user: belongsTo('user'),
});
