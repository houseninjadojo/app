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

  workOrders = this.args.workOrders.map((w) => {
    return {
      id: w.id,
      name: w.description,
      description: w.vendor,
      scheduledTime: w.scheduledTime,
      scheduledDate: w.scheduledDate,
      ...w,
    };
  });
}
