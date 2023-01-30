import Component from '@glimmer/component';
import { isHistoricalWorkOrder } from 'houseninja/utils/components/work-order/work-order-status';
import format from 'date-fns/format';
import compareDesc from 'date-fns/compareDesc';
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
            (w.completedAt && format(w.completedAt, 'MM/dd/yyyy')) || '',
          status: w.status,
          // tag: w.status && getWorkOrderTag(w.status),
        };
      })
      ?.sort((a, b) => {
        if (!a.completedAt && !b.completedAt) return 0;
        if (!a.completedAt) return 1;
        if (!b.completedAt) return -1;
        return compareDesc(a.completedAt, b.completedAt);
      });
  }

  displayedWorkOrders = [...(this.inactiveWorkOrders ?? [])];
}
