import { Model, belongsTo } from 'miragejs';

export default Model.extend({
  property: belongsTo('property'),
});
