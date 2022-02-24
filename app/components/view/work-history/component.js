import Component from '@glimmer/component';

export default class WorkHistoryComponent extends Component {
  tabs = [
    // {
    //   label: 'Open Work Orders',
    //   active: true,
    // },
  ];
  workOrders = this.args.workOrders.map((w) => {
    return {
      name: w.description,
      description: w.vendor,
      // scheduledTime: w.scheduledTime,
      scheduledDate: w.scheduledDate,
    };
  });
}
