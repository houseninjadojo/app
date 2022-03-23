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
        description: w.scheduledDate && w.vendor,
        scheduledDate: w.scheduledDate,
        scheduledTime: w.scheduledDate && w.scheduledTime,
        status: w.status,
        tag: w.status && getWorkOrderTag(w.status),
        ...w,
      };
    })
    .filter((w) => {
      const activeWorkOrder =
        w.status !== workOrderStatus.invoicePaidByCustomer &&
        w.status !== workOrderStatus.closed &&
        w.status !== workOrderStatus.cancelled &&
        w.status !== workOrderStatus.paused;
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
        w.scheduledDate
    )
    .sort((a, b) => {
      return (
        moment(a.scheduledDate, DATE_FORMAT) <
          moment(b.scheduledDate, DATE_FORMAT) ||
        (a.scheduledDate && !b.scheduledDate)
      );
    });

  nonBookedWorkOrders = this.allWorkOrders.filter((w) => !w.scheduledDate);

  currentWorkOrders = [
    ...this.failedPaymentWorkOrders,
    ...this.approvePaymentWorkOrders,
    ...this.bookedWorkOrders,
    ...this.nonBookedWorkOrders,
  ];

  @action
  selectRoute(routeName) {
    this.router.transitionTo(routeName);
  }
}
