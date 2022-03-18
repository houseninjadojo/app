import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';
import moment from 'moment';
import { workOrderStatus } from 'houseninja/data/work-order-status';

const DATE_FORMAT = 'MM/DD/YY';

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

  allWorkOrders = this.args.workOrders.map((w) => {
    return {
      id: w.id,
      name: w.description,
      description: w.vendor,
      scheduledTime: w.scheduledTime,
      scheduledDate: w.scheduledDate,
      status: w.status,
      ...w,
    };
  });

  currentWorkOrders = this.allWorkOrders
    .filter((w) => {
      const activeWorkOrder =
        w.status !== workOrderStatus.invoicePaidByCustomer &&
        w.status !== workOrderStatus.closed;
      return activeWorkOrder;
    })
    .sort((a, b) => {
      return (
        moment(a.scheduledDate, DATE_FORMAT) >
        moment(b.scheduledDate, DATE_FORMAT)
      );
    });

  @action
  selectRoute(routeName) {
    this.router.transitionTo(routeName);
  }
}
