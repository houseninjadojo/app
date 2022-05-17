import Component from '@glimmer/component';
import {
  getWorkOrderTag,
  isHistoricalWorkOrder,
  newestToOldest,
} from 'houseninja/utils/components/work-order/work-order-status';

export default class WorkHistoryComponent extends Component {
  inactiveWorkOrders = this.args.workOrders
    ?.filter((w) => {
      return isHistoricalWorkOrder(w.status);
    })
    .map((w) => {
      return {
        id: w.id,
        name: w.description,
        description: w.vendor,
        scheduledTime: null, // Don't display time
        scheduledDate: w.scheduledDate,
        status: w.status,
        tag: w.status && getWorkOrderTag(w.status),
        ...w,
      };
    })

    .sort((a, b) => {
      return newestToOldest(a, b);
    });

  displayedWorkOrders = [...this.inactiveWorkOrders];
}
