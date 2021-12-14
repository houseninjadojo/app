import { Factory, association, trait } from 'ember-cli-mirage';

export default Factory.extend({
  address: association(),
  default: true,
  selected: true,

  withUser: trait({
    user: association(),
  }),
});
