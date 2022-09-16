import { Model, belongsTo } from 'miragejs';

export default Model.extend({
  estimate: belongsTo('estimate'),
  invoice: belongsTo('invoice'),
  property: belongsTo('property'),
});
