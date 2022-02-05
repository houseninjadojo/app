import { Model, hasMany } from 'miragejs';

export default Model.extend({
  subscription: hasMany('subscription'),
});
