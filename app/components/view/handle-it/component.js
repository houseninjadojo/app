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

  get paymentDueWorkOrders() {
    return filterWorkOrdersFor(
      WORK_ORDER_FILTER.PAYMENT_DUE,
      this.activeWorkOrders
    )?.sort((a, b) => {
      return newestToOldest(a, b);
    });
  }

  get scheduledWorkOrders() {
    return filterWorkOrdersFor(
      WORK_ORDER_FILTER.SCHEDULED,
      this.activeWorkOrders
    )?.sort((a, b) => {
      return newestToOldest(a, b);
    });
  }

  get initiatedWorkOrders() {
    return filterWorkOrdersFor(
      WORK_ORDER_FILTER.INITITATED,
      this.activeWorkOrders
    )?.sort((a, b) => {
      return newestToOldest(a, b);
    });
  }

  get displayedWorkOrders() {
    return [
      ...(this.paymentDueWorkOrders ?? []),
      ...(this.scheduledWorkOrders ?? []),
      ...(this.initiatedWorkOrders ?? []),
    ];
  }

  @action
  selectRoute(routeName) {
    this.router.transitionTo(routeName);
  }
}
