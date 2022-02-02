import { Model, belongsTo, hasMany } from 'miragejs';

export default Model.extend({
  address: belongsTo('address'),
  serviceArea: belongsTo('service-area'),
  user: belongsTo('user'),
  workOrders: hasMany('work-order'),
});
