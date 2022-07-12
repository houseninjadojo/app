import { Factory } from 'miragejs';
import { faker } from '@faker-js/faker';

export default Factory.extend({
  active() {
    return true;
  },

  code() {
    return faker.random.alphaNumeric(12);
  },

  name() {
    return '10% off';
  },

  percentOff() {
    return '10.0';
  },

  createdAt() {
    return new Date();
  },

  updatedAt() {
    return new Date();
  },
});
