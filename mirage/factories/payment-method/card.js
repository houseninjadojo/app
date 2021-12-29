// import { Factory } from 'ember-cli-mirage';
import PaymentMethod from './index';
import faker from 'faker';

export default PaymentMethod.extend({
  brand() {
    return faker.random.arrayElement(['visa', 'mastercard']);
  },

  country() {
    return 'us';
  },

  cvv() {
    return faker.finance.creditCardCVV();
  },

  expMonth() {
    return faker.datatype.number({
      min: 1,
      max: 12,
      precision: 1,
    });
  },

  expYear() {
    const currentYear = new Date().getFullYear();
    return faker.datatype.number({
      min: currentYear + 1,
      max: currentYear + 7,
      precision: 1,
    });
  },

  number() {
    return faker.finance.creditCardNumber(this.brand);
  },
});
