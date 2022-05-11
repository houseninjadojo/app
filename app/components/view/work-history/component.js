import Component from '@glimmer/component';
import moment from 'moment';
import { workOrderStatus } from 'houseninja/data/work-order-status';
import { getWorkOrderTag } from 'houseninja/utils/components/work-order/work-order-status';

const DATE_FORMAT = 'MM/DD/YY';
export default class WorkHistoryComponent extends Component {
  allWorkOrders = this.args.workOrders.map((w) => {
    return {
      id: w.id,
      name: w.description,
      description: w.vendor,
      // scheduledTime: w.scheduledTime,
      scheduledDate: w.scheduledDate,
      status: w.status,
      tag: w.status && getWorkOrderTag(w.status),
      ...w,
    };
  });

  inactiveWorkOrders = this.allWorkOrders
    .filter((w) => {
      const historicalWorkOrder =
        w.status === workOrderStatus.invoicePaidByCustomer ||
        w.status === workOrderStatus.closed;
      return historicalWorkOrder;
    })
    .sort((a, b) => {
      return (
        moment(a.scheduledDate, DATE_FORMAT) <
        moment(b.scheduledDate, DATE_FORMAT)
      );
    });

  pastWorkOrders = [...this.inactiveWorkOrders];
}
