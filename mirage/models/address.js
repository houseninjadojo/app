import { Model, belongsTo } from 'miragejs';

export default Model.extend({
  // addressible: belongsTo({ polymorphic: true, inverse: 'property' }),
  property: belongsTo('property'),
});
