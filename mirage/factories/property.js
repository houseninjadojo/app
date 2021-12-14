import { Factory, association, trait } from 'ember-cli-mirage';
import faker from 'faker';

export default Factory.extend({
  line1() {
    return faker.address.streetAddress();
  },

  line2() {
    return null;
  },

  city() {
    return faker.address.city();
  },

  state() {
    return faker.address.stateAbbr();
  },

  postalCode() {
    return faker.address.zipCode();
  },

  default: true,
  selected: true,

  withUser: trait({
    user: association(),
  }),
});
