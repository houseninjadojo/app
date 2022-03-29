import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';
import moment from 'moment';
import { workOrderStatus } from 'houseninja/data/work-order-status';
import { getWorkOrderTag } from 'houseninja/utils/components/work-order/work-order-status';

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

  allWorkOrders = this.args.workOrders
    .map((w) => {
      return {
        id: w.id,
        name: w.description,
        description:
          w.status !== workOrderStatus.paused && w.scheduledDate
            ? w.vendor
            : null,
        scheduledDate:
          w.status !== workOrderStatus.paused ? w.scheduledDate : null,
        scheduledTime:
          w.status !== workOrderStatus.paused && w.scheduledDate
            ? w.scheduledTime
            : null,
        status: w.status,
        tag: w.status && getWorkOrderTag(w.status),
        ...w,
      };
    })
    .filter((w) => {
      const activeWorkOrder =
        w.status !== workOrderStatus.workRequestReceived &&
        w.status !== workOrderStatus.invoicePaidByCustomer &&
        w.status !== workOrderStatus.closed &&
        w.status !== workOrderStatus.cancelled;
      return activeWorkOrder;
    });
  failedPaymentWorkOrders = this.allWorkOrders
    .filter((w) => w.status === workOrderStatus.paymentFailed)
    .sort((a, b) => {
      return (
        moment(a.scheduledDate, DATE_FORMAT) <
        moment(b.scheduledDate, DATE_FORMAT)
      );
    });

  approvePaymentWorkOrders = this.allWorkOrders
    .filter((w) => w.status === workOrderStatus.invoiceSentToCustomer)
    .sort((a, b) => {
      return (
        moment(a.scheduledDate, DATE_FORMAT) <
        moment(b.scheduledDate, DATE_FORMAT)
      );
    });

  bookedWorkOrders = this.allWorkOrders
    .filter(
      (w) =>
        w.status !== workOrderStatus.paymentFailed &&
        w.status !== workOrderStatus.invoiceSentToCustomer &&
        w.status !== workOrderStatus.paused &&
        w.scheduledDate
    )
    .sort((a, b) => {
      return (
        moment(a.scheduledDate, DATE_FORMAT) <
          moment(b.scheduledDate, DATE_FORMAT) ||
        (a.scheduledDate && !b.scheduledDate)
      );
    });

  nonBookedWorkOrders = this.allWorkOrders.filter(
    (w) => !w.scheduledDate && w.status !== workOrderStatus.paused
  );

  pausedWorkOrders = this.allWorkOrders.filter(
    (w) => w.status === workOrderStatus.paused
  );

  currentWorkOrders = [
    ...this.approvePaymentWorkOrders,
    ...this.failedPaymentWorkOrders,
    ...this.bookedWorkOrders,
    ...this.nonBookedWorkOrders,
    ...this.pausedWorkOrders,
  ];

  @action
  selectRoute(routeName) {
    this.router.transitionTo(routeName);
  }
}
