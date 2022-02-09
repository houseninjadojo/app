import { Factory, association, trait } from 'miragejs';
// import faker from '@faker-js/faker';

export default Factory.extend({
  // user: association(),

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
