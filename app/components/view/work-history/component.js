import Component from '@glimmer/component';
import moment from 'moment';
import {
  getWorkOrderTag,
  isHistoricalWorkOrder,
} from 'houseninja/utils/components/work-order/work-order-status';

const DATE_FORMAT = 'MM/DD/YY';
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
        // scheduledTime: w.scheduledTime,
        scheduledDate: w.scheduledDate,
        status: w.status,
        tag: w.status && getWorkOrderTag(w.status),
        ...w,
      };
    })

    .sort((a, b) => {
      return (
        moment(a.scheduledDate, DATE_FORMAT) <
        moment(b.scheduledDate, DATE_FORMAT)
      );
    });

  displayedWorkOrders = [...this.inactiveWorkOrders];
}
