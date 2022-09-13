import { Factory } from 'miragejs';
import { faker } from '@faker-js/faker';

export default Factory.extend({
  description() {
    return faker.lorem.sentence(1);
  },

  amount() {
    return faker.commerce.price(100, 10000, 2, '$');
  },

  vendorCategory() {
    return faker.commerce.department();
  },

  vendorName() {
    return faker.company.name();
  },

  // approvedAt() {
  //   return faker.date.past(1);
  // },

  scheduledWindowStart() {
    return faker.date.future(1);
  },

  scheduledWindowEnd() {
    return faker.date.future(2);
  },
});
