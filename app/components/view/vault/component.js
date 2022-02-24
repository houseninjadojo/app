import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';

export default class VaultContentComponent extends Component {
  @service router;

  groupStub = [
    {
      id: 'insurance',
      name: 'Insurance',
      description: 'Home insurance documents',
      type: 'group',
      iconUri: this.getIconUri('group'),
    },
    {
      id: 'warranty',
      name: 'Home Warranty',
      description: 'Home warranty documents',
      type: 'group',
      iconUri: this.getIconUri('group'),
    },
    {
      id: 'inspection',
      name: 'Home Inspection Reports',
      description: 'Home inspections',
      type: 'group',
      iconUri: this.getIconUri('group'),
    },
    {
      id: 'manuals',
      name: 'Manuals',
      description: 'Appliance manuals',
      type: 'group',
      iconUri: this.getIconUri('group'),
    },
  ];

  groups = this.groupStub.map((g) => {
    return {
      id: g.id,
      name: g.name,
      description: g.description,
      type: g.type,
      iconUri: this.getIconUri(g.type),
    };
  });

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

  documents = this.documentStub.map((g) => {
    return {
      id: g.id,
      name: g.name,
      description: g.description,
      type: g.type,
      iconUri: this.getIconUri(g.type),
    };
  });

  getIconUri(type) {
    const PATH = '/assets/icons';
    switch (type) {
      case 'group':
        return `${PATH}/folder.svg`;
      case 'pdf':
        return `${PATH}/pdf.svg`;
      case 'png':
        return `${PATH}/image.svg`;
      case 'jpg':
        return `${PATH}/image.svg`;
      case 'heic':
        return `${PATH}/image.svg`;
      case 'zip':
        return `${PATH}/zip.svg`;
      default:
        return `${PATH}/`;
    }
  }

  @action
  selectRoute(routeName) {
    if (typeof routeName === 'string') {
      this.router.transitionTo(routeName);
    }
    if (typeof routeName === 'object') {
      console.log(routeName);
    }
  }
}
