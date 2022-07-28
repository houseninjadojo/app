import Component from '@glimmer/component';
import { isHistoricalWorkOrder } from 'houseninja/utils/components/work-order/work-order-status';
import moment from 'moment';

export default class WorkHistoryComponent extends Component {
  get inactiveWorkOrders() {
    return this.args.workOrders
      ?.filter((w) => {
        return isHistoricalWorkOrder(w.status);
      })
      ?.map((w) => {
        return {
          id: w.id,
          name: w.description,
          description: w.vendor,
          displayTime: null, // Don't display time
          completedAt: w.completedAt,
          displayDate:
            (w.completedAt && moment(w.completedAt).format('MM/DD/YYYY')) || '',
          status: w.status,
          // tag: w.status && getWorkOrderTag(w.status),
          ...w,
        };
      })
      ?.sort((a, b) => {
        const FORMAT = 'YYYYMMDD';
        console.log(a.completedAt);
        console.log(b.completedAt);
        // console.log(
        //   moment(b.completedAt)?.format(FORMAT) -
        //     moment(a.completedAt)?.format(FORMAT)
        // );
        return (
          moment(b.completedAt)?.format(FORMAT) -
          moment(a.completedAt)?.format(FORMAT)
        );
      });
  }

  displayedWorkOrders = [...(this.inactiveWorkOrders ?? [])];
}
