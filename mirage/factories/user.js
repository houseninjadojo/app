import { Factory, association } from 'ember-cli-mirage';
import faker from 'faker';

export default Factory.extend({
  property: association(),

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
});
