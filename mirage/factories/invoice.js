import { Factory, association } from 'miragejs';
import faker from '@faker-js/faker';

export default Factory.extend({
  document: association(),

  description() {
    return 'House Ninja Monthly Recurring Subscription';
  },

  // @type 'draft'|'open'|'paid'|'uncollectible'|'void'
  status() {
    return 'paid';
  },

  total() {
    return '29.00';
  },

  periodStart() {
    return faker.date.recent(5);
  },

  periodEnd() {
    return faker.date.recent(30, this.periodStart);
  },

  createdAt() {
    return new Date();
  },

  updatedAt() {
    return new Date();
  },
});
