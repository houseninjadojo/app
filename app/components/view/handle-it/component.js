import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';
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

  get activeWorkOrders() {
    return this.args.workOrders
      ?.filter((w) => {
        return isActiveWorkOrder(w.status);
      })
      ?.map((w) => {
        return {
          id: w.id,
          name: w.description,
          description: w.vendor && w.scheduledDate ? w.vendor : null,
          scheduledDate: w.vendor && w.scheduledDate ? w.scheduledDate : null,
          scheduledTime:
            w.vendor && w.scheduledDate && w.scheduledTime
              ? w.scheduledTime
              : null,
          status: w.status,
          tag: w.status && getWorkOrderTag(w.status),
          ...w,
        };
      });
  }

  get failedPaymentWorkOrders() {
    return filterWorkOrdersFor(
      WORK_ORDER_FILTER.FAILED_PAYMENT,
      this.activeWorkOrders
    )?.sort((a, b) => {
      return newestToOldest(a, b);
    });
  }

  get approvePaymentWorkOrders() {
    return filterWorkOrdersFor(
      WORK_ORDER_FILTER.APPROVE_PAYMENT,
      this.activeWorkOrders
    )?.sort((a, b) => {
      return newestToOldest(a, b);
    });
  }

  get remainingBookedWorkOrders() {
    return filterWorkOrdersFor(
      WORK_ORDER_FILTER.BOOKED_NOT_APPROVE_AND_NOT_FAILED,
      this.activeWorkOrders
    )?.sort((a, b) => {
      return newestToOldest(a, b);
    });
  }

  get initiatedWorkOrders() {
    return filterWorkOrdersFor(
      WORK_ORDER_FILTER.NOT_BOOKED_NOT_APPROVE_AND_NOT_FAILED,
      this.activeWorkOrders
    )?.sort((a, b) => {
      return newestToOldest(a, b);
    });
  }

  get displayedWorkOrders() {
    return [
      ...(this.approvePaymentWorkOrders ?? []),
      ...(this.failedPaymentWorkOrders ?? []),
      ...(this.remainingBookedWorkOrders ?? []),
      ...(this.initiatedWorkOrders ?? []),
    ];
  }

  @action
  selectRoute(routeName) {
    this.router.transitionTo(routeName);
  }
}
