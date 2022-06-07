import { Factory, association } from 'miragejs';
import faker from '@faker-js/faker';
import moment from 'moment';
import { workOrderStatus } from 'houseninja/data/work-order-status';

const pastOrFuture = () => {
  return faker.random.boolean()
    ? faker.date.past(1, moment())
    : faker.date.future(1, moment());
};

const getRandomProperty = (obj) => {
  const keys = Object.keys(obj);
  const randomKey = keys[Math.floor(Math.random() * keys.length)];

  return obj[randomKey];
};

export default Factory.extend({
  invoice: association(),

  scheduledDate() {
    return moment(pastOrFuture()).format('MM/DD/YY');
  },

  scheduledTime() {
    return '10:00AM - 2:00PM';
  },

  vendor() {
    return faker.company.companyName();
  },

  description() {
    return faker.lorem.sentence(4);
  },

  status() {
    return getRandomProperty(workOrderStatus);
    // return 'closed';
  },

  invoiceUri() {
    return '';
  },

  notes() {
    return faker.lorem.sentence(7);
  },
});
