import { faker } from '@faker-js/faker';
import { WorkOrderStatus } from 'houseninja/data/work-order-status';

const getRandomProperty = (obj) => {
  return faker.helpers.arrayElement(Object.values(obj));
};

export default [
  {
    id: faker.datatype.uuid(),
    description: 'Cabinet repair',
    vendor: 'Custom Cabinet Solutions',
    scheduledDate: '07/15/22',
    scheduledTime: '11:00AM',
    cost: '$100',
    status: getRandomProperty(WorkOrderStatus),
    // status: WorkOrderStatus.InvoiceSentToCustomer,
  },
  {
    id: faker.datatype.uuid(),
    description: 'Power washing',
    vendor: 'Hydro Wash',
    scheduledDate: '09/15/22',
    scheduledTime: '10:00AM',
    status: getRandomProperty(WorkOrderStatus),
    // status: WorkOrderStatus.WorkScheduled,
  },
  {
    id: faker.datatype.uuid(),
    description: 'Exterior light repair',
    vendor: 'American Electric',
    scheduledDate: '09/08/22',
    scheduledTime: '9:00AM - 12:00PM',
    status: getRandomProperty(WorkOrderStatus),
    // status: WorkOrderStatus.WorkScheduled,
  },
  {
    id: faker.datatype.uuid(),
    description: 'Dryer vent cleaning',
    vendor: 'Johnson Duct Cleaning',
    scheduledDate: '09/02/22',
    scheduledTime: '5:00PM',
    status: getRandomProperty(WorkOrderStatus),
    // status: WorkOrderStatus.WorkScheduled,
  },
  {
    id: faker.datatype.uuid(),
    description: 'Window washing',
    vendor: 'Elite Windows',
    scheduledDate: '09/01/22',
    scheduledTime: '8:00AM',
    status: getRandomProperty(WorkOrderStatus),
    // status: WorkOrderStatus.WorkScheduled,
  },
  {
    id: faker.datatype.uuid(),
    description: 'Water heater servicing',
    vendor: '4Paws Plumbing',
    scheduledDate: '01/07/22',
    scheduledTime: '10:00AM',
    status: getRandomProperty(WorkOrderStatus),
  },
  {
    id: faker.datatype.uuid(),
    description: 'Semi-Annual Preventative Maintenance',
    vendor: '',
    scheduledDate: '09/22/21',
    scheduledTime: '10:00AM',
    status: WorkOrderStatus.Closed,
  },
  // {
  //   id: faker.datatype.uuid(),
  //   description: 'Tree Trimming',
  //   vendor: 'Wilder Tree & Lawn',
  //   scheduledDate: '01/05/22',
  //   scheduledTime: '10:00AM',
  //   status: WorkOrderStatus.PaymentFailed,
  // },
  // {
  //   id: faker.datatype.uuid(),
  //   description: 'Fence Repair',
  //   vendor: 'Wilder Tree & Lawn',
  //   scheduledDate: '10/29/21',
  //   scheduledTime: '10:00AM',
  //   status: WorkOrderStatus.InvoiceSentToCustomer,
  // },

  {
    id: faker.datatype.uuid(),
    description: 'HVAC Service',
    vendor: 'AirServ',
    // scheduledDate: '10/22/21',
    scheduledTime: '10:00AM',
    status: WorkOrderStatus.EstimateNotApproved,
  },
];
