import { Factory } from 'miragejs';
import { faker } from '@faker-js/faker';

export default Factory.extend({
  description(): string {
    return faker.lorem.sentence(1);
  },

  amount(): string {
    return faker.commerce.price(100, 10000, 2, '$');
  },

  vendorCategory(): string {
    return faker.commerce.department();
  },

  vendorName(): string {
    return faker.company.name();
  },

  // approvedAt() {
  //   return faker.date.past(1);
  // },

  scheduledWindowStart(): Date {
    return faker.date.future(1);
  },

  scheduledWindowEnd(): Date {
    return faker.date.future(2);
  },
});
