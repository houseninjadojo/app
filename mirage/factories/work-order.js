import { Factory, association } from 'miragejs';
import { faker } from '@faker-js/faker';
import moment from 'moment';
import { WorkOrderStatus } from 'houseninja/data/work-order-status';

const pastOrFuture = () => {
  return faker.datatype.boolean()
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

  completedAt() {
    return moment(faker.date.past(3, moment()));
  },

  updatedAt() {
    return moment(faker.date.past(3, moment()));
  },

  createdAt() {
    return moment(faker.date.past(5, moment()));
  },

  scheduledDate() {
    return moment(pastOrFuture()).format('MM/DD/YYYY');
  },

  scheduledTime() {
    return '10:00AM - 2:00PM';
  },

  vendor() {
    return faker.company.name();
  },

  description() {
    return faker.lorem.sentence(4);
  },

  status() {
    return getRandomProperty(WorkOrderStatus);
    // return 'closed';
  },

  invoiceUri() {
    return '';
  },

  notes() {
    return faker.lorem.sentence(7);
  },
});
