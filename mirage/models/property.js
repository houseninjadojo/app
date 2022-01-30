import { Model, belongsTo } from 'miragejs';

export default Model.extend({
  address: belongsTo('address'),
  serviceArea: belongsTo('service-area'),
  user: belongsTo('user'),
});
