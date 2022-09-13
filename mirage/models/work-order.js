import { Model, belongsTo, hasMany } from 'miragejs';

export default Model.extend({
  estimates: hasMany('estimate'),
  invoice: belongsTo('invoice'),
  property: belongsTo('property'),
});
