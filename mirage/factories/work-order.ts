import { Factory, association } from 'miragejs';
import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';
import { WorkOrderStatus } from 'houseninja/data/work-order-status';

const pastOrFuture = (): Date => {
  return faker.datatype.boolean() ? faker.date.past(1) : faker.date.future(1);
};

export default Factory.extend({
  invoice: association(),
  estimate: association(),

  completedAt(): Date {
    return faker.date.past(3);
  },

  updatedAt(): Date {
    return faker.date.past(3);
  },

  createdAt(): Date {
    return faker.date.past(5);
  },

  scheduledDate(): string {
    return dayjs(pastOrFuture()).format('MM/DD/YYYY');
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
    // return WorkOrderStatus.EstimateSharedWithHomeowner;
  },

  invoiceUri(): string {
    return '';
  },

  notes(): string {
    return faker.lorem.sentence(7);
  },
});
