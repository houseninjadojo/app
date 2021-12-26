import { Model, belongsTo } from 'ember-cli-mirage';

export default Model.extend({
  addressible: belongsTo({ polymorphic: true }),
});
