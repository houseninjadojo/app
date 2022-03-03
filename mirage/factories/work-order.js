import { Factory } from 'miragejs';
import faker from '@faker-js/faker';
import moment from 'moment';

function pastOrFuture() {
  return faker.random.boolean()
    ? faker.date.past(1, moment())
    : faker.date.future(1, moment());
}

export default Factory.extend({
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
    return 'open';
  },

  invoiceUri() {
    return '';
  },
});
