import { Model, belongsTo } from 'miragejs';

export default Model.extend({
  invoice: belongsTo('invoice'),
});
