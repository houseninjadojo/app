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

  amountOff() {
    null;
  },

  percentOff() {
    return '10.0';
  },

  duration() {
    return 'repeating';
  },

  durationInMonths() {
    return 2;
  },

  createdAt() {
    return new Date();
  },

  updatedAt() {
    return new Date();
  },
});
