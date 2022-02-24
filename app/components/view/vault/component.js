import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';

export default class VaultContentComponent extends Component {
  @service router;

  groups = [
    {
      id: 'insurance',
      name: 'Insurance',
      description: 'Home insurance documents',
      type: 'group',
      iconUri: '/assets/icons/hamboyga.svg',
    },
    {
      id: 'manuals',
      name: 'Manuals',
      description: 'Appliance manuals',
      type: 'group',
      iconUri: '/assets/icons/hamboyga.svg',
    },
  ];
  documents = [
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

  @action
  selectRoute(routeName) {
    this.router.transitionTo(routeName);
  }
}
