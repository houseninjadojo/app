import { Factory, association } from 'ember-cli-mirage';

export default Factory.extend({
  address: association(),

  default: true,
  selected: true,
});
