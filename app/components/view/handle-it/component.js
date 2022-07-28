import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';
import {
  getWorkOrderTag,
  isActiveWorkOrder,
  newestToOldestScheduledDate,
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

  get paymentDueWorkOrders() {
    return filterWorkOrdersFor(
      WORK_ORDER_FILTER.PAYMENT_DUE,
      this.activeWorkOrders
    )?.sort(newestToOldestScheduledDate);
  }

  get completedWorkOrders() {
    return filterWorkOrdersFor(
      WORK_ORDER_FILTER.COMPLETED,
      this.activeWorkOrders
    )?.sort(newestToOldestScheduledDate);
  }

  get scheduledWorkOrders() {
    return filterWorkOrdersFor(
      WORK_ORDER_FILTER.SCHEDULED,
      this.activeWorkOrders
    )?.sort(newestToOldestScheduledDate);
  }

  get completedAndScheduledWorkOrders() {
    return [
      ...(this.completedWorkOrders ?? []),
      ...(this.scheduledWorkOrders ?? []),
    ]?.sort(newestToOldestScheduledDate);
  }

  get initiatedWorkOrders() {
    return filterWorkOrdersFor(
      WORK_ORDER_FILTER.INITITATED,
      this.activeWorkOrders
    )?.sort(newestToOldestScheduledDate);
  }

  get displayedWorkOrders() {
    return [
      ...(this.paymentDueWorkOrders ?? []),
      ...(this.completedAndScheduledWorkOrders ?? []),
      ...(this.initiatedWorkOrders ?? []),
    ];
  }

  @action
  selectRoute(routeName) {
    this.router.transitionTo(routeName);
  }
}
