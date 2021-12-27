import { Factory, association, trait } from 'ember-cli-mirage';
import faker from 'faker';

export default Factory.extend({
  street1() {
    return faker.address.streetAddress();
  },

  street2() {
    return null;
  },

  city() {
    return faker.address.city();
  },

  state() {
    return faker.address.stateAbbr();
  },

  zipcode() {
    return faker.address.zipCode();
  },

  withProperty: trait({
    addressible: association('property'),
  }),
});
