import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';
export default class HandleItComponent extends Component {
  @service router;

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

  @action
  selectRoute(routeName) {
    this.router.transitionTo(routeName);
  }
}
