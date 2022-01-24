import { Model, belongsTo } from 'miragejs';

export default Model.extend({
  user: belongsTo('user'),
  address: belongsTo('address'),
});
