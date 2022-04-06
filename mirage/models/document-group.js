import { Model, belongsTo, hasMany } from 'miragejs';

export default Model.extend({
  user: belongsTo('user'),
  documents: hasMany('document'),
});
