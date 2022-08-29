import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';
import {
  getWorkOrderTag,
  isActiveWorkOrder,
  filterWorkOrdersFor,
  WORK_ORDER_FILTER,
} from 'houseninja/utils/components/work-order/work-order-status';
import moment from 'moment';
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
          createdAt: w.createdAt,
          scheduledDate: w.scheduledDate,
          displayDate:
            w.vendor && w.scheduledDate
              ? moment(new Date(w.scheduledDate)).format('MM/DD/YYYY')
              : null,
          displayTime:
            w.vendor && w.scheduledDate && w.scheduledTime
              ? w.scheduledTime
              : null,
          status: w.status,
          tag: w.status && getWorkOrderTag(w.status),
          ...w,
        };
      });
  }

  __newestToOldest(a, b, sortByCreatedAt = false) {
    const FORMAT = 'MM/DD/YYYY';

    if (sortByCreatedAt) {
      return moment(b.createdAt, FORMAT) - moment(a.createdAt, FORMAT);
    } else {
      return moment(b.scheduledDate, FORMAT) - moment(a.scheduledDate, FORMAT);
    }
  }

  get paymentDueWorkOrders() {
    return filterWorkOrdersFor(
      WORK_ORDER_FILTER.PAYMENT_DUE,
      this.activeWorkOrders
    )?.sort((a, b) => {
      return this.__newestToOldest(a, b);
    });
  }

  get completedWorkOrders() {
    return filterWorkOrdersFor(
      WORK_ORDER_FILTER.COMPLETED,
      this.activeWorkOrders
    );
  }

  get scheduledWorkOrders() {
    return filterWorkOrdersFor(
      WORK_ORDER_FILTER.SCHEDULED,
      this.activeWorkOrders
    );
  }

  get completedAndScheduledWorkOrders() {
    return [
      ...(this.completedWorkOrders ?? []),
      ...(this.scheduledWorkOrders ?? []),
    ]?.sort((a, b) => {
      return this.__newestToOldest(a, b);
    });
  }

  get initiatedWorkOrders() {
    return filterWorkOrdersFor(
      WORK_ORDER_FILTER.INITITATED,
      this.activeWorkOrders
    )?.sort((a, b) => {
      return this.__newestToOldest(a, b, true);
    });
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
