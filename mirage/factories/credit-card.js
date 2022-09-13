import PaymentMethod from './payment-method';
import { faker } from '@faker-js/faker';

export default PaymentMethod.extend({
  brand() {
    return faker.helpers.arrayElement([
      'amex',
      'discover',
      'mastercard',
      'visa',
    ]);
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

  cardNumber() {
    return faker.finance.creditCardNumber(this.brand);
  },

  zipcode() {
    return faker.address.zipCode('#####');
  },
});
