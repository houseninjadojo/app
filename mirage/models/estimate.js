import { Model, belongsTo } from 'miragejs';

export default Model.extend({
  workOrder: belongsTo('work-order'),
});
