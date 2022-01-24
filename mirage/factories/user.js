import { Factory } from 'miragejs';
import faker from 'faker';

export default Factory.extend({
  // properties: association(),

  email() {
    return faker.internet.email();
  },

  firstName() {
    return faker.name.firstName();
  },

  lastName() {
    return faker.name.lastName();
  },

  phoneNumber() {
    return faker.phone.phoneNumber();
  },

  afterCreate(user, server) {
    user.update({
      properties: server.createList('property', 1),
    });
  },
});
