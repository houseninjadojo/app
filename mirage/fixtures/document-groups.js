import faker from '@faker-js/faker';

export const documentGroup = {
  insurance: faker.datatype.uuid(),
  warranty: faker.datatype.uuid(),
  inspection: faker.datatype.uuid(),
  manual: faker.datatype.uuid(),
  unnamed: faker.datatype.uuid(),
};

export default [
  {
    id: documentGroup.insurance,
    name: 'Insurance',
    // description: 'Home insurance documents',
    type: 'group',
    iconUri: '',
    owner: '',
  },
  {
    id: documentGroup.warranty,
    name: 'Home Warranty',
    // description: 'Home warranty documents',
    type: 'group',
    iconUri: '',
    owner: '',
  },
  {
    id: documentGroup.inspection,
    name: 'Home Inspection Reports',
    // description: 'Home inspections',
    type: 'group',
    iconUri: '',
    owner: '',
  },
  {
    id: documentGroup.manual,
    name: 'Manuals',
    // description: 'Appliance manuals',
    type: 'group',
    iconUri: '',
    owner: '',
  },
  {
    id: documentGroup.unnamed,
    name: 'Unnamed Group',
    // description: '',
    type: 'group',
    iconUri: '',
    owner: '',
  },
];
