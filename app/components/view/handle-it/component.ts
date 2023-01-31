import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';
import {
  getWorkOrderTag,
  isActiveWorkOrder,
  filterWorkOrdersFor,
  WorkOrderState,
} from 'houseninja/utils/components/work-order/work-order-status';
import { compareDesc } from 'houseninja/utils/dates';
import WorkOrder from 'houseninja/models/work-order';
import RouterService from '@ember/routing/router-service';

type Args = {
  workOrders: WorkOrder[];
};

export default class HandleItComponent extends Component<Args> {
  @service declare router: RouterService;

  tabs = [
    {
      label: 'Open Service Requests',
      active: true,
      query: {
        status: 'open',
      },
    },
  ];

  get activeWorkOrders(): WorkOrder[] {
    return this.args.workOrders
      ?.filter((w) => {
        return isActiveWorkOrder(w.status);
      })
      ?.map((w) => {
        return {
          ...w,
          id: w.id,
          name: w.description,
          description: w.vendor && w.scheduledDate ? w.vendor : undefined,
          createdAt: w.createdAt,
          scheduledDate: w.scheduledDate,
          displayDate: w.displayDate,
          displayTime: w.displayTime,
          status: w.status,
          tag: w.status && getWorkOrderTag(w.status),
        };
      }) as unknown as WorkOrder[];
  }

  #newestToOldest(a: WorkOrder, b: WorkOrder, sortByCreatedAt = false): number {
    if (sortByCreatedAt) {
      return compareDesc(a.createdAt, b.createdAt);
    } else {
      return compareDesc(a.scheduledDateParsed, b.scheduledDateParsed);
    }
  }

  get paymentDueWorkOrders(): WorkOrder[] {
    return filterWorkOrdersFor(
      WorkOrderState.PaymentDue,
      this.activeWorkOrders
    )?.sort(this.#newestToOldest);
  }

  get estimateReviewWorkOrders(): WorkOrder[] {
    return filterWorkOrdersFor(
      WorkOrderState.Estimate,
      this.activeWorkOrders
    )?.sort(this.#newestToOldest);
  }

  get completedWorkOrders(): WorkOrder[] {
    return filterWorkOrdersFor(WorkOrderState.Completed, this.activeWorkOrders);
  }

  get scheduledWorkOrders(): WorkOrder[] {
    return filterWorkOrdersFor(WorkOrderState.Scheduled, this.activeWorkOrders);
  }

  get schedulingWorkOrders(): WorkOrder[] {
    return filterWorkOrdersFor(
      WorkOrderState.Scheduling,
      this.activeWorkOrders
    );
  }

  get completedAndScheduledAndSchedulingWorkOrders(): WorkOrder[] {
    return [
      ...(this.completedWorkOrders ?? []),
      ...(this.scheduledWorkOrders ?? []),
      ...(this.schedulingWorkOrders ?? []),
    ]?.sort(this.#newestToOldest);
  }

  get initiatedWorkOrders(): WorkOrder[] {
    return filterWorkOrdersFor(
      WorkOrderState.Initiated,
      this.activeWorkOrders
    )?.sort((a, b) => {
      return this.#newestToOldest(a, b, true);
    });
  }

  get displayedWorkOrders(): WorkOrder[] {
    return [
      ...(this.paymentDueWorkOrders ?? []),
      ...(this.estimateReviewWorkOrders ?? []),
      ...(this.completedAndScheduledAndSchedulingWorkOrders ?? []),
      ...(this.initiatedWorkOrders ?? []),
    ];
  }

  @action
  selectRoute(routeName: string): void {
    this.router.transitionTo(routeName);
  }
}
