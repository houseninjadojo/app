import {
  WorkOrderStatus,
  WorkOrderUILabel,
  WorkOrderStatusLabel,
} from 'houseninja/data/work-order-status';

import WorkOrder from 'houseninja/models/work-order';

export const getWorkOrderTag = (status: WorkOrderStatus) => {
  switch (status) {
    case WorkOrderStatus.Paused:
      return {
        label: getWorkOrderStatusLabel(status),
        type: 'disabled',
      };
    case WorkOrderStatus.Cancelled:
    case WorkOrderStatus.Closed:
    case WorkOrderStatus.InvoicePaidByCustomer:
      return;
    case WorkOrderStatus.PaymentFailed:
    case WorkOrderStatus.InvoiceSentToCustomer:
      return {
        label: getWorkOrderStatusLabel(status),
        type: 'accent',
      };
    case WorkOrderStatus.VendorInvoiceReceived:
    case WorkOrderStatus.ReadyToInvoiceCustomer:
    case WorkOrderStatus.ProblemResolved:
    case WorkOrderStatus.ProblemBeingAddressed:
    case WorkOrderStatus.ProblemReported:
    case WorkOrderStatus.WorkCompleted:
    case WorkOrderStatus.WalkthroughCompleted:
      // case WorkOrderStatus.Referred:
      return {
        label: getWorkOrderStatusLabel(status),
        type: 'accent-outline',
      };
    case WorkOrderStatus.ChangeOrderReceived:
    case WorkOrderStatus.WorkInProgress:
    case WorkOrderStatus.WorkScheduled:
    case WorkOrderStatus.HomeWalkthroughScheduled:
      return {
        label: getWorkOrderStatusLabel(status),
        type: 'primary',
      };
    case WorkOrderStatus.EstimateSharedWithHomeowner:
      return {
        label: getWorkOrderStatusLabel(status),
        type: 'secondary',
      };
    case WorkOrderStatus.SchedulingInProgress:
      return {
        label: getWorkOrderStatusLabel(status),
        // type: 'secondary',
      };
    case WorkOrderStatus.EstimateNotApproved:
    case WorkOrderStatus.EstimateApproved:
    case WorkOrderStatus.OnsiteEstimateScheduled:
    case WorkOrderStatus.VendorIdentified:
    case WorkOrderStatus.WorkOrderInitiated:
    case WorkOrderStatus.WorkRequestReceived:
    case WorkOrderStatus.WalkthroughReportSent:
    default:
      return {
        label: getWorkOrderStatusLabel(status),
        // type: null,
      };
  }
};

export const getWorkOrderStatusLabel = (
  status: WorkOrderStatus
): WorkOrderUILabel => {
  return WorkOrderStatusLabel[status as WorkOrderStatusLabel];
};

export const isActiveWorkOrder = (status: WorkOrderStatus): boolean => {
  switch (status) {
    case WorkOrderStatus.WorkOrderInitiated:
    case WorkOrderStatus.VendorIdentified:
    case WorkOrderStatus.SchedulingInProgress:
    case WorkOrderStatus.OnsiteEstimateScheduled:
    case WorkOrderStatus.EstimateSharedWithHomeowner:
    case WorkOrderStatus.EstimateApproved:
    case WorkOrderStatus.EstimateNotApproved:
    case WorkOrderStatus.WorkScheduled:
    case WorkOrderStatus.WorkInProgress:
    case WorkOrderStatus.ChangeOrderReceived:
    case WorkOrderStatus.WorkCompleted:
    case WorkOrderStatus.ProblemReported:
    case WorkOrderStatus.ProblemBeingAddressed:
    case WorkOrderStatus.ProblemResolved:
    case WorkOrderStatus.VendorInvoiceReceived:
    case WorkOrderStatus.ReadyToInvoiceCustomer:
    case WorkOrderStatus.InvoiceSentToCustomer:
    case WorkOrderStatus.PaymentFailed:
    case WorkOrderStatus.HomeWalkthroughScheduled:
    case WorkOrderStatus.WalkthroughCompleted:
      return true;
    // case WorkOrderStatus.WorkRequestReceived:
    // case WorkOrderStatus.InvoicePaidByCustomer:
    // case WorkOrderStatus.Closed:
    // case WorkOrderStatus.Paused:
    // case WorkOrderStatus.Cancelled:
    // case WorkOrderStatus.Canceled:
    // case WorkOrderStatus.Referred:
    default:
      return false;
  }
};

export const isHistoricalWorkOrder = (status: WorkOrderStatus): boolean => {
  switch (status) {
    // case WorkOrderStatus.workRequestReceived:
    // case WorkOrderStatus.workOrderInitiated:
    // case WorkOrderStatus.vendorIdentified:
    // case WorkOrderStatus.schedulingInProgress:
    // case WorkOrderStatus.onsiteEstimateScheduled:
    // case WorkOrderStatus.estimateSharedWithHomeowner:
    // case WorkOrderStatus.estimateApproved:
    // case WorkOrderStatus.estimateNotApproved:
    // case WorkOrderStatus.workScheduled:
    // case WorkOrderStatus.workInProgress:
    // case WorkOrderStatus.changeOrderReceived:
    // case WorkOrderStatus.workCompleted:
    // case WorkOrderStatus.problemReported:
    // case WorkOrderStatus.problemBeingAddressed:
    // case WorkOrderStatus.problemResolved:
    // case WorkOrderStatus.vendorInvoiceReceived:
    // case WorkOrderStatus.readyToInvoiceCustomer:
    // case WorkOrderStatus.invoiceSentToCustomer:
    // case WorkOrderStatus.paymentFailed:
    case WorkOrderStatus.InvoicePaidByCustomer:
    case WorkOrderStatus.Closed:
    case WorkOrderStatus.WalkthroughReportSent:
      return true;
    // case WorkOrderStatus.paused:
    // case WorkOrderStatus.cancelled:
    // case WorkOrderStatus.canceled:
    // case WorkOrderStatus.referred:
    default:
      return false;
  }
};

export const isCompletedWorkOrder = (status: WorkOrderStatus): boolean => {
  switch (status) {
    case WorkOrderStatus.WorkCompleted:
    case WorkOrderStatus.ProblemReported:
    case WorkOrderStatus.ProblemBeingAddressed:
    case WorkOrderStatus.ProblemResolved:
    case WorkOrderStatus.VendorInvoiceReceived:
    case WorkOrderStatus.ReadyToInvoiceCustomer:
    case WorkOrderStatus.WalkthroughCompleted:
      return true;
    default:
      return false;
  }
};

/**
 * @deprecated
 */
export const WORK_ORDER_STATE = {
  INITITATED: 'inititated',
  ESTIMATE: 'estimate',
  SCHEDULED: 'scheduled',
  SCHEDULING: 'scheduling',
  PAYMENT_DUE: 'payment due',
  COMPLETED: 'completed',
  PAUSED: 'paused',
};

export enum WorkOrderState {
  Initiated = 'inititated',
  Estimate = 'estimate',
  Scheduled = 'scheduled',
  Scheduling = 'scheduling',
  PaymentDue = 'payment due',
  Completed = 'completed',
  Paused = 'paused',
}

export const filterWorkOrdersFor = (
  filter: WorkOrderState,
  workOrders: WorkOrder[] = []
): WorkOrder[] => {
  let filteredWorkOrders: WorkOrder[] = [];
  switch (filter) {
    case WorkOrderState.PaymentDue:
      filteredWorkOrders = workOrders.filter((w) => {
        return (
          WorkOrderStatusLabel[w.status as WorkOrderStatusLabel] ===
          WorkOrderUILabel.PaymentDue
        );
      });
      break;
    case WorkOrderState.Estimate:
      filteredWorkOrders = workOrders.filter((w) => {
        return (
          WorkOrderStatusLabel[w.status as WorkOrderStatusLabel] ===
          WorkOrderUILabel.Estimate
        );
      });
      break;
    case WorkOrderState.Scheduled:
      filteredWorkOrders = workOrders.filter(
        (w) =>
          WorkOrderStatusLabel[w.status as WorkOrderStatusLabel] ===
          WorkOrderUILabel.Scheduled
      );
      break;
    case WorkOrderState.Completed:
      filteredWorkOrders = workOrders.filter(
        (w) =>
          WorkOrderStatusLabel[w.status as WorkOrderStatusLabel] ===
          WorkOrderUILabel.Completed
      );
      break;
    case WorkOrderState.Scheduling:
      filteredWorkOrders = workOrders.filter(
        (w) =>
          WorkOrderStatusLabel[w.status as WorkOrderStatusLabel] ===
          WorkOrderUILabel.Scheduling
      );
      break;
    case WorkOrderState.Initiated:
      filteredWorkOrders = workOrders.filter((w) => {
        return (
          WorkOrderStatusLabel[w.status as WorkOrderStatusLabel] ===
          WorkOrderUILabel.Initiated
        );
      });
      break;
    case WorkOrderState.Paused:
      filteredWorkOrders = workOrders.filter(
        (w) =>
          WorkOrderStatusLabel[w.status as WorkOrderStatusLabel] ===
          WorkOrderUILabel.Paused
      );
      break;
  }
  return filteredWorkOrders;
};
