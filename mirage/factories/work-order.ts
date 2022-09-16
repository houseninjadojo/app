import { Factory, association } from 'miragejs';
import { faker } from '@faker-js/faker';
import * as moment from 'moment';
import { WorkOrderStatus } from 'houseninja/data/work-order-status';

const pastOrFuture = (): Date => {
  return faker.datatype.boolean()
    ? faker.date.past(1, moment().toDate())
    : faker.date.future(1, moment().toDate());
};

export default Factory.extend({
  invoice: association(),
  estimate: association(),

  completedAt(): Date {
    return moment(faker.date.past(3, moment().toDate())).toDate();
  },

  updatedAt(): Date {
    return moment(faker.date.past(3, moment().toDate())).toDate();
  },

  createdAt(): Date {
    return moment(faker.date.past(5, moment().toDate())).toDate();
  },

  scheduledDate(): string {
    return moment(pastOrFuture()).format('MM/DD/YYYY');
  },

  scheduledTime(): string {
    return '10:00AM - 2:00PM';
  },

  vendor(): string {
    return faker.company.name();
  },

  description(): string {
    return faker.lorem.sentence(4);
  },

  status(): WorkOrderStatus {
    return faker.helpers.arrayElement(Object.values(WorkOrderStatus));
    // return 'closed';
  },

  invoiceUri(): string {
    return '';
  },

  notes(): string {
    return faker.lorem.sentence(7);
  },
});
