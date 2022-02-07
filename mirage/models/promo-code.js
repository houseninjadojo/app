import { Model, hasMany } from 'miragejs';

export default Model.extend({
  invoices: hasMany('invoice'),
  subscriptions: hasMany('subscription'),
  users: hasMany('user'),
});
