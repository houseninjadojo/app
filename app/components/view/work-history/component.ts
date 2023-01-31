import Component from '@glimmer/component';
import { isHistoricalWorkOrder } from 'houseninja/utils/components/work-order/work-order-status';
import dayjs from 'dayjs';
import { compareDesc } from 'houseninja/utils/dates';
import WorkOrder from 'houseninja/models/work-order';

type Args = {
  workOrders: WorkOrder[];
};

export default class WorkHistoryComponent extends Component<Args> {
  get inactiveWorkOrders() {
    return this.args.workOrders
      ?.filter((w) => {
        return isHistoricalWorkOrder(w.status);
      })
      ?.map((w) => {
        return {
          ...w,
          id: w.id,
          name: w.description,
          description: w.vendor,
          displayTime: null, // Don't display time
          completedAt: w.completedAt,
          displayDate:
            (w.completedAt && dayjs(w.completedAt).format('MM/DD/YYYY')) || '',
          status: w.status,
          // tag: w.status && getWorkOrderTag(w.status),
        };
      })
      ?.sort((a, b) => compareDesc(a.completedAt, b.completedAt));
  }

  displayedWorkOrders = [...(this.inactiveWorkOrders ?? [])];
}
