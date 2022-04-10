import faker from '@faker-js/faker';

export const documentIds = {
  homeInsurance: faker.datatype.uuid(),
  homeInspection: faker.datatype.uuid(),
  homeWarranty: faker.datatype.uuid(),
  majorHomeAppliancesManual: faker.datatype.uuid(),
  paintColors: faker.datatype.uuid(),
  walkthroughReport: faker.datatype.uuid(),
  preventativeMaintenancePlan: faker.datatype.uuid(),
};

// we need this here and not in `document-groups.js`
// in order to avoid circular dependencies
export const documentGroupIds = {
  insurance: faker.datatype.uuid(),
  warranty: faker.datatype.uuid(),
  inspection: faker.datatype.uuid(),
  manual: faker.datatype.uuid(),
  unnamed: faker.datatype.uuid(),
};

export default [
  {
    id: documentIds.homeInsurance,
    name: 'Home Insurance',
    // description: faker.lorem.sentence(4),
    contentType: 'image/png',
    url: 'https://kw-demo-docs.s3.us-east-2.amazonaws.com/insurance.png',
    iconUri: '',
    documentGroupId: documentGroupIds.insurance,
    tags: [],
  },
  {
    id: documentIds.homeInspection,
    name: 'Home Inspection',
    // description: faker.lorem.sentence(4),
    contentType: 'application/pdf',
    url: 'https://kw-demo-docs.s3.us-east-2.amazonaws.com/inspection.pdf',
    iconUri: '',
    documentGroupId: documentGroupIds.inspection,
    tags: [],
  },
  {
    id: documentIds.homeWarranty,
    name: 'Home Warranty',
    // description: faker.lorem.sentence(4),
    contentType: 'image/jpg',
    url: 'https://kw-demo-docs.s3.us-east-2.amazonaws.com/warranty.jpg',
    iconUri: '',
    documentGroupId: documentGroupIds.warranty,
    tags: [],
  },
  {
    id: documentIds.majorHomeAppliancesManual,
    name: 'Major Home Appliances Manual',
    // description: faker.lorem.sentence(4),
    contentType: 'application/pdf',
    url: 'https://kw-demo-docs.s3.us-east-2.amazonaws.com/manual.pdf',
    iconUri: '',
    documentGroupId: documentGroupIds.manual,
    tags: [],
  },
  {
    id: documentIds.paintColors,
    name: 'Paint Colors',
    // description: faker.lorem.sentence(4),
    contentType: 'image/jpg',
    url: 'https://kw-demo-docs.s3.us-east-2.amazonaws.com/paint-colors.jpg',
    iconUri: '',
    documentGroupId: null,
    tags: [],
  },
  {
    id: documentIds.walkthroughReport,
    name: 'Walkthrough Report',
    // description: faker.lorem.sentence(4),
    contentType: 'application/pdf',
    url: 'https://kw-demo-docs.s3.us-east-2.amazonaws.com/Andrew+Kerrigan+Walkthrough.pdf',
    iconUri: '',
    documentGroupId: null,
    tags: ['system:walkthrough-report'],
  },
  {
    id: documentIds.preventativeMaintenancePlan,
    name: 'My Preventative Maintenance Plan',
    // description: faker.lorem.sentence(4),
    contentType: 'application/pdf',
    url: 'https://kw-demo-docs.s3.us-east-2.amazonaws.com/Andrew+Kerrigan+Preventative+Maintenance+Calendar.pdf',
    iconUri: '',
    documentGroupId: null,
    tags: ['system:preventative-maintenance-report'],
  },
];
