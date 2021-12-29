import { Factory, association } from 'ember-cli-mirage';
// import faker from 'faker';

export default Factory.extend({
  user: association(),
  address: association(),

  createdAt() {
    return new Date();
  },

  updatedAt() {
    return new Date();
  },
});
