import { Model, belongsTo, hasMany } from 'miragejs';

export default Model.extend({
  serviceArea: belongsTo('service-area'),
  user: belongsTo('user'),
  workOrders: hasMany('work-order'),
});
