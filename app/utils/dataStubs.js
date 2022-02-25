import faker from '@faker-js/faker';

const group = {
  insurance: faker.datatype.uuid(),
  warranty: faker.datatype.uuid(),
  inspection: faker.datatype.uuid(),
  manual: faker.datatype.uuid(),
  unnamed: faker.datatype.uuid(),
};

export const vault = {
  documentStub: [
    {
      id: faker.datatype.uuid(),
      name: 'home insurance',
      description: faker.lorem.sentence(4),
      type: 'png',
      uri: '/assets/demo/insurance.png',
      iconUri: '',
      groupId: group.insurance,
    },
    {
      id: faker.datatype.uuid(),
      name: 'home inspection',
      description: faker.lorem.sentence(4),
      type: 'pdf',
      uri: '/assets/demo/inspection.pdf',
      iconUri: '',
      groupId: group.inspection,
    },
    {
      id: faker.datatype.uuid(),
      name: 'home warranty',
      description: faker.lorem.sentence(4),
      type: 'jpg',
      uri: '/assets/demo/warranty.jpg',
      iconUri: '',
      groupId: group.warranty,
    },
    {
      id: faker.datatype.uuid(),
      name: 'major home appliances manual',
      description: faker.lorem.sentence(4),
      type: 'pdf',
      uri: '/assets/demo/manual.pdf',
      iconUri: '',
      groupId: group.manual,
    },
    {
      id: faker.datatype.uuid(),
      name: 'paint colors',
      description: faker.lorem.sentence(4),
      type: 'jpg',
      uri: '/assets/demo/paint-colors.jpg',
      iconUri: '',
      groupId: null,
    },
  ],

  groupStub: [
    {
      id: group.insurance,
      name: 'Insurance',
      description: 'Home insurance documents',
      type: 'group',
      iconUri: '',
    },
    {
      id: group.warranty,
      name: 'Home Warranty',
      description: 'Home warranty documents',
      type: 'group',
      iconUri: '',
    },
    {
      id: group.inspection,
      name: 'Home Inspection Reports',
      description: 'Home inspections',
      type: 'group',
      iconUri: '',
    },
    {
      id: group.manual,
      name: 'Manuals',
      description: 'Appliance manuals',
      type: 'group',
      iconUri: '',
    },
    {
      id: group.unnamed,
      name: 'Unnamed Group',
      description: '',
      type: 'group',
      iconUri: '',
    },
  ],
};
