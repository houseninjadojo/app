import { Factory, association } from 'miragejs';
import { faker } from '@faker-js/faker';

export default Factory.extend({
  document: association(),
  receipt: association('document'),

  description() {
    return 'Invoice #' + faker.datatype.number({ min: 10000, max: 99999 });
  },

  // @type 'draft'|'open'|'paid'|'uncollectible'|'void'
  status() {
    return 'paid';
  },

  total() {
    return faker.finance.amount(1000, 10000, 0);
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

  formattedTotal() {
    return `$${this.total}.00`;
  },
});
