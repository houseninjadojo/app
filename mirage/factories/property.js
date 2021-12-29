import { Factory, association, trait } from 'ember-cli-mirage';
import faker from 'faker';

export default Factory.extend({
  address: association(),

  lotSize() {
    return faker.datatype.number({ min: 10000, max: 100000 });
  },

  homeSize() {
    return faker.datatype.number({ min: 1000, max: 10000 });
  },

  garageSize() {
    return faker.datatype.number({ min: 0, max: 2 });
  },

  homeAge() {
    return faker.datatype.number({ min: 1, max: 100 });
  },

  estimatedValue() {
    return faker.datatype.number({ min: 500000, max: 15000000 });
  },

  bedrooms() {
    return faker.datatype.number({ min: 1, max: 10 });
  },

  bathrooms() {
    return faker.datatype.number({ min: 1, max: 10 });
  },

  pools() {
    return faker.datatype.number({ min: 0, max: 1 });
  },

  default: true,
  selected: true,

  withUser: trait({
    user: association(),
  }),
});
