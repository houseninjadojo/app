import { faker } from '@faker-js/faker';
import { workOrderStatus } from 'houseninja/data/work-order-status';

const getRandomProperty = (obj) => {
  const keys = Object.keys(obj);
  const randomKey = keys[Math.floor(Math.random() * keys.length)];

  return workOrderStatus[randomKey];
};

export default [
  {
    id: faker.datatype.uuid(),
    description: 'Holiday Lights Installation',
    vendor: 'CTWC',
    scheduledDate: '11/28/21',
    scheduledTime: '10:00AM',
    status: getRandomProperty(workOrderStatus),
  },
  {
    id: faker.datatype.uuid(),
    description: 'Water heater servicing',
    vendor: '4Paws Plumbing',
    scheduledDate: '01/07/22',
    scheduledTime: '10:00AM',
    status: getRandomProperty(workOrderStatus),
  },
  {
    id: faker.datatype.uuid(),
    description: 'Semi-Annual Preventative Maintenance',
    vendor: '',
    scheduledDate: '09/22/21',
    scheduledTime: '10:00AM',
    status: workOrderStatus.closed,
  },
  {
    id: faker.datatype.uuid(),
    description: 'Tree Trimming',
    vendor: 'Wilder Tree & Lawn',
    scheduledDate: '01/05/22',
    scheduledTime: '10:00AM',
    status: workOrderStatus.paymentFailed,
  },
  {
    id: faker.datatype.uuid(),
    description: 'Fence Repair',
    vendor: 'Wilder Tree & Lawn',
    scheduledDate: '10/29/21',
    scheduledTime: '10:00AM',
    status: workOrderStatus.invoiceSentToCustomer,
  },
  {
    id: faker.datatype.uuid(),
    description: 'Exterior light repair',
    vendor: 'Cooke Electric',
    // scheduledDate: '03/26/22',
    // scheduledTime: '10:00AM',
    // status: getRandomProperty(workOrderStatus),
    status: workOrderStatus.estimateSharedWithHomeowner,
  },
  {
    id: faker.datatype.uuid(),
    description: 'Window cleaning',
    vendor: 'Central Texas Windows',
    scheduledDate: '03/25/22',
    scheduledTime: '12:00PM - 5:00PM',
    // status: getRandomProperty(workOrderStatus),
    status: workOrderStatus.paused,
  },
  {
    id: faker.datatype.uuid(),
    description: 'HVAC Service',
    vendor: 'AirServ',
    // scheduledDate: '10/22/21',
    scheduledTime: '10:00AM',
    status: workOrderStatus.estimateNotApproved,
  },
  {
    id: faker.datatype.uuid(),
    description: 'Dryer vent cleaning',
    vendor: 'Lake Travis Dryer Vent',
    scheduledDate: '03/22/22',
    scheduledTime: '10:00AM',
    status: getRandomProperty(workOrderStatus),
  },
  {
    id: faker.datatype.uuid(),
    description: 'Power washing',
    vendor: 'Fanin Professional Services',
    scheduledDate: '03/28/22',
    scheduledTime: '12:00PM',
    status: getRandomProperty(workOrderStatus),
  },
];
