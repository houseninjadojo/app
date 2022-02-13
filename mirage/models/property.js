import { Model, belongsTo, hasMany } from 'miragejs';

export default Model.extend({
  documents: hasMany('document'),
  serviceArea: belongsTo('service-area'),
  user: belongsTo('user'),
  workOrders: hasMany('work-order'),
});
