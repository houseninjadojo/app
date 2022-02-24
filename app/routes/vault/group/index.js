import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class VaultGroupIndexRoute extends Route {
  @service router;
  documentStub = [
    {
      id: 'asdf',
      name: 'asdfasdf.png',
      description: 'description asdfasdf.png',
      type: 'png',
      iconUri: '/assets/icons/hamboyga.svg',
    },
    {
      id: 'zxcv',
      name: 'zxcvzxcv.pdf',
      description: 'description zxcvzxcv.pdf',
      type: 'pdf',
      iconUri: '/assets/icons/hamboyga.svg',
    },
  ];
  groupStub = [
    {
      id: 'insurance',
      name: 'Insurance',
      description: 'Home insurance documents',
      type: 'group',
      //   iconUri: this.getIconUri('group'),
      documents: this.documentStub,
    },
    {
      id: 'warranty',
      name: 'Home Warranty',
      description: 'Home warranty documents',
      type: 'group',
      //   iconUri: this.getIconUri('group'),
      documents: this.documentStub,
    },
    {
      id: 'inspection',
      name: 'Home Inspection Reports',
      description: 'Home inspections',
      type: 'group',
      //   iconUri: this.getIconUri('group'),
      documents: this.documentStub,
    },
    {
      id: 'manuals',
      name: 'Manuals',
      description: 'Appliance manuals',
      type: 'group',
      //   iconUri: this.getIconUri('group'),
      documents: this.documentStub,
    },
  ];
  model(params) {
    console.log(params);
    const model = this.groupStub.filter((g) => g.id === params.group_id)[0];
    return model;
  }
}
