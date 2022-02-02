import { Factory } from 'miragejs';
import faker from '@faker-js/faker';

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
    let paymentMethods = server.createList('credit-card', 1);
    let properties = server.createList('property', 1);
    user.update({
      properties,
      paymentMethods,
    });
  },
});
