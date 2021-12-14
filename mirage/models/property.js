import { Model, belongsTo } from 'ember-cli-mirage';

export default Model.extend({
  address: belongsTo('property/address'),
  user: belongsTo('user'),
});
