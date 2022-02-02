import { Factory, association, trait } from 'miragejs';
// import faker from 'faker';

export default Factory.extend({
  // user: association(),
  // address: association(),

  createdAt() {
    return new Date();
  },

  updatedAt() {
    return new Date();
  },

  withUser: trait({
    user: association(),
  }),
});
