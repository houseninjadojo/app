import { faker } from '@faker-js/faker';

const currentYear = new Date().getFullYear();
const brand = 'amex';

export default [
  {
    id: faker.datatype.uuid(),
    brand,
    cvv: faker.finance.creditCardCVV(),
    expMonth: faker.datatype.number({
      min: 1,
      max: 12,
      precision: 1,
    }),
    expYear: faker.datatype.number({
      min: currentYear + 1,
      max: currentYear + 7,
      precision: 1,
    }),
    cardNumber: faker.finance.creditCardNumber(brand),
    zipcode: faker.address.zipCode('#####'),
    isDefault: true,
  },
];
