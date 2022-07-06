import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { workOrderStatus } from 'houseninja/data/work-order-status';
import {
  getWorkOrderTag,
  isActiveWorkOrder,
  newestToOldest,
  filterWorkOrdersFor,
  WORK_ORDER_FILTER,
} from 'houseninja/utils/components/work-order/work-order-status';

export default class HandleItComponent extends Component {
  @service router;

  tabs = [
    {
      label: 'Open Service Requests',
      active: true,
      query: {
        status: 'open',
      },
    },
  ];

  activeWorkOrders = this.args.workOrders
    ?.filter((w) => {
      return isActiveWorkOrder(w.status);
    })
    ?.map((w) => {
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
    });

  failedPaymentWorkOrders = filterWorkOrdersFor(
    WORK_ORDER_FILTER.FAILED_PAYMENT,
    this.activeWorkOrders
  )?.sort((a, b) => {
    return newestToOldest(a, b);
  });

  approvePaymentWorkOrders = filterWorkOrdersFor(
    WORK_ORDER_FILTER.APPROVE_PAYMENT,
    this.activeWorkOrders
  )?.sort((a, b) => {
    return newestToOldest(a, b);
  });

  remainingBookedWorkOrders = filterWorkOrdersFor(
    WORK_ORDER_FILTER.BOOKED_NOT_APPROVE_AND_NOT_FAILED,
    this.activeWorkOrders
  )?.sort((a, b) => {
    return newestToOldest(a, b);
  });

  nonBookedWorkOrders = filterWorkOrdersFor(
    WORK_ORDER_FILTER.NOT_BOOKED_NOT_APPROVE_AND_NOT_FAILED,
    this.activeWorkOrders
  )?.sort((a, b) => {
    return newestToOldest(a, b);
  });

  pausedWorkOrders = filterWorkOrdersFor(
    WORK_ORDER_FILTER.PAUSED,
    this.activeWorkOrders
  )?.sort((a, b) => {
    return newestToOldest(a, b);
  });

  get displayedWorkOrders() {
    return [
      ...(this.approvePaymentWorkOrders ?? []),
      ...(this.failedPaymentWorkOrders ?? []),
      ...(this.remainingBookedWorkOrders ?? []),
      ...(this.nonBookedWorkOrders ?? []),
      ...(this.pausedWorkOrders ?? []),
    ];
  }

  @action
  selectRoute(routeName) {
    this.router.transitionTo(routeName);
  }
}
