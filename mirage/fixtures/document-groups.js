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
    description: 'Home insurance documents',
    iconUri: '',
    owner: '',
  },
  {
    id: documentGroup.warranty,
    name: 'Home Warranty',
    description: 'Home warranty documents',
    iconUri: '',
    owner: '',
  },
  {
    id: documentGroup.inspection,
    name: 'Home Inspection Reports',
    description: 'Home inspections',
    iconUri: '',
    owner: '',
  },
  {
    id: documentGroup.manual,
    name: 'Manuals',
    description: 'Appliance manuals',
    iconUri: '',
    owner: '',
  },
  {
    id: documentGroup.unnamed,
    name: 'Unnamed Category',
    // description: '',
    iconUri: '',
    owner: '',
  },
];
