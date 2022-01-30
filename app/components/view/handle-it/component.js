import Component from '@glimmer/component';

export default class HandleItComponent extends Component {
  tabs = [
    {
      label: 'Open Work Orders',
      active: true,
      query: {
        status: 'open',
      },
    },
  ];
}
