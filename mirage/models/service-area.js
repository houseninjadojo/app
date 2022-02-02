import { Model, hasMany } from 'miragejs';

export default Model.extend({
  properties: hasMany('property'),
});
