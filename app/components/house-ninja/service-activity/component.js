import Component from '@glimmer/component';

export default class ServiceActivityComponent extends Component {
  tabs = [
    {
      label: 'Open Work Orders',
      active: true,
    },
  ];

  serviceRecords = [
    {
      date: '11/11/21',
      time: '10:00AM - 2:00PM',
      vendor: 'Paulie’s Plumbing Services',
      description: 'Lorem ipsum dolor sit amet',
      invoiceUri: '',
    },
    {
      date: '11/11/21',
      time: '10:00AM - 2:00PM',
      vendor: 'Paulie’s Plumbing Services',
      description: 'Lorem ipsum dolor sit amet',
      invoiceUri: '',
    },
    {
      date: '11/11/21',
      time: '10:00AM - 2:00PM',
      vendor: 'Paulie’s Plumbing Services',
      description: 'Lorem ipsum dolor sit amet',
      invoiceUri: '',
    },
  ];

  get getActiveTabContent() {
    return this.activeRecords.filter((r) => r.active)[0];
  }

  get userHasUpcomingService() {
    return this.serviceRecords.length > 0;
  }
}
