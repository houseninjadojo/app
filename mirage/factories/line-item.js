import { Factory, association } from 'miragejs';
import faker from '@faker-js/faker';

export default Factory.extend({
  invoice: association(),

  amount() {
    return faker.finance.amount({ min: 100, max: 1000 });
  },

  description() {
    return faker.commerce.productDescription();
  },

  name() {
    return faker.commerce.productName();
  },
});
