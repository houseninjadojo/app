import {
  workOrderStatus,
  WORK_ORDER_UI_LABEL,
  workOrderStatusLabels,
} from 'houseninja/data/work-order-status';

export const getWorkOrderTag = (status) => {
  switch (status) {
    case workOrderStatus.paused:
      return {
        label: getWorkOrderStatusLabel(status),
        type: 'disabled',
      };
    case workOrderStatus.cancelled:
    case workOrderStatus.closed:
    case workOrderStatus.invoicePaidByCustomer:
      return;
    case workOrderStatus.paymentFailed:
    case workOrderStatus.invoiceSentToCustomer:
      return {
        label: getWorkOrderStatusLabel(status),
        type: 'accent',
      };
    case workOrderStatus.vendorInvoiceReceived:
    case workOrderStatus.readyToInvoiceCustomer:
    case workOrderStatus.problemResolved:
    case workOrderStatus.problemBeingAddressed:
    case workOrderStatus.problemReported:
    case workOrderStatus.workCompleted:
    case workOrderStatus.walkthroughCompleted:
      // case workOrderStatus.referred:
      return {
        label: getWorkOrderStatusLabel(status),
        type: 'accent-outline',
      };
    case workOrderStatus.changeOrderReceived:
    case workOrderStatus.workInProgress:
    case workOrderStatus.workScheduled:
    case workOrderStatus.homeWalkthroughScheduled:
      return {
        label: getWorkOrderStatusLabel(status),
        type: 'primary',
      };
    case workOrderStatus.estimateSharedWithHomeowner:
      return {
        label: getWorkOrderStatusLabel(status),
        type: 'secondary',
      };
    case workOrderStatus.estimateNotApproved:
    case workOrderStatus.estimateApproved:
    case workOrderStatus.onsiteEstimateScheduled:
    case workOrderStatus.schedulingInProgress:
    case workOrderStatus.vendorIdentified:
    case workOrderStatus.workOrderInititated:
    case workOrderStatus.workRequestReceived:
    case workOrderStatus.walkthroughReportSent:
    default:
      return {
        label: getWorkOrderStatusLabel(status),
        // type: null,
      };
  }
};

export const getWorkOrderStatusLabel = (status) => {
  return workOrderStatusLabels[status];
};

export const isActiveWorkOrder = (status) => {
  switch (status) {
    case workOrderStatus.workOrderInitiated:
    case workOrderStatus.vendorIdentified:
    case workOrderStatus.schedulingInProgress:
    case workOrderStatus.onsiteEstimateScheduled:
    case workOrderStatus.estimateSharedWithHomeowner:
    case workOrderStatus.estimateApproved:
    case workOrderStatus.estimateNotApproved:
    case workOrderStatus.workScheduled:
    case workOrderStatus.workInProgress:
    case workOrderStatus.changeOrderReceived:
    case workOrderStatus.workCompleted:
    case workOrderStatus.problemReported:
    case workOrderStatus.problemBeingAddressed:
    case workOrderStatus.problemResolved:
    case workOrderStatus.vendorInvoiceReceived:
    case workOrderStatus.readyToInvoiceCustomer:
    case workOrderStatus.invoiceSentToCustomer:
    case workOrderStatus.paymentFailed:
    case workOrderStatus.homeWalkthroughScheduled:
    case workOrderStatus.walkthroughCompleted:
      return true;
    // case workOrderStatus.workRequestReceived:
    // case workOrderStatus.invoicePaidByCustomer:
    // case workOrderStatus.closed:
    // case workOrderStatus.paused:
    // case workOrderStatus.cancelled:
    // case workOrderStatus.canceled:
    // case workOrderStatus.referred:
    default:
      return false;
  }
};

export const isHistoricalWorkOrder = (status) => {
  switch (status) {
    // case workOrderStatus.workRequestReceived:
    // case workOrderStatus.workOrderInitiated:
    // case workOrderStatus.vendorIdentified:
    // case workOrderStatus.schedulingInProgress:
    // case workOrderStatus.onsiteEstimateScheduled:
    // case workOrderStatus.estimateSharedWithHomeowner:
    // case workOrderStatus.estimateApproved:
    // case workOrderStatus.estimateNotApproved:
    // case workOrderStatus.workScheduled:
    // case workOrderStatus.workInProgress:
    // case workOrderStatus.changeOrderReceived:
    // case workOrderStatus.workCompleted:
    // case workOrderStatus.problemReported:
    // case workOrderStatus.problemBeingAddressed:
    // case workOrderStatus.problemResolved:
    // case workOrderStatus.vendorInvoiceReceived:
    // case workOrderStatus.readyToInvoiceCustomer:
    // case workOrderStatus.invoiceSentToCustomer:
    // case workOrderStatus.paymentFailed:
    case workOrderStatus.invoicePaidByCustomer:
    case workOrderStatus.closed:
    case workOrderStatus.walkthroughReportSent:
      return true;
    // case workOrderStatus.paused:
    // case workOrderStatus.cancelled:
    // case workOrderStatus.canceled:
    // case workOrderStatus.referred:
    default:
      return false;
  }
};

export const isCompletedWorkOrder = (status) => {
  switch (status) {
    case workOrderStatus.workCompleted:
    case workOrderStatus.problemReported:
    case workOrderStatus.problemBeingAddressed:
    case workOrderStatus.problemResolved:
    case workOrderStatus.vendorInvoiceReceived:
    case workOrderStatus.readyToInvoiceCustomer:
    case workOrderStatus.walkthroughCompleted:
      return true;
    default:
      return false;
  }
};

export const WORK_ORDER_STATE = {
  INITITATED: 'inititated',
  ESTIMATE: 'estimate',
  SCHEDULED: 'scheduled',
  PAYMENT_DUE: 'payment due',
  COMPLETED: 'completed',
  PAUSED: 'paused',
};

export const filterWorkOrdersFor = (filter, workOrders = []) => {
  let filteredWorkOrders = [];
  switch (filter) {
    case WORK_ORDER_STATE.PAYMENT_DUE:
      filteredWorkOrders = workOrders.filter((w) => {
        return (
          workOrderStatusLabels[w.status] === WORK_ORDER_UI_LABEL.PAYMENT_DUE
        );
      });
      break;
    case WORK_ORDER_STATE.ESTIMATE:
      filteredWorkOrders = workOrders.filter((w) => {
        return workOrderStatusLabels[w.status] === WORK_ORDER_UI_LABEL.ESTIMATE;
      });
      break;
    case WORK_ORDER_STATE.SCHEDULED:
      filteredWorkOrders = workOrders.filter(
        (w) => workOrderStatusLabels[w.status] === WORK_ORDER_UI_LABEL.SCHEDULED
      );
      break;
    case WORK_ORDER_STATE.COMPLETED:
      filteredWorkOrders = workOrders.filter(
        (w) => workOrderStatusLabels[w.status] === WORK_ORDER_UI_LABEL.COMPLETED
      );
      break;
    case WORK_ORDER_STATE.INITITATED:
      filteredWorkOrders = workOrders.filter((w) => {
        return (
          workOrderStatusLabels[w.status] === WORK_ORDER_UI_LABEL.INITIATED
        );
      });
      break;
    case WORK_ORDER_STATE.PAUSED:
      filteredWorkOrders = workOrders.filter(
        (w) => workOrderStatusLabels[w.status] === WORK_ORDER_UI_LABEL.PAUSED
      );
      break;
  }
  return filteredWorkOrders;
};
