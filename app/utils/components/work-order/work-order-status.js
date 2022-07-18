import {
  workOrderStatus,
  workOrderStatusLabels,
} from 'houseninja/data/work-order-status';
import moment from 'moment';

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
    case workOrderStatus.readyToInvoice:
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
    // case workOrderStatus.estimateSharedWithHomeowner:
    // return {
    //   label: getWorkOrderStatusLabel(status),
    //   type: 'secondary-outline',
    // };
    case workOrderStatus.estimateSharedWithHomeowner:
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
    case workOrderStatus.readyToInvoice:
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
    // case workOrderStatus.readyToInvoice:
    // case workOrderStatus.invoiceSentToCustomer:
    // case workOrderStatus.paymentFailed:
    case workOrderStatus.invoicePaidByCustomer:
    case workOrderStatus.closed:
    case workOrderStatus.walkthroughReportSent:
      return true;
    // case workOrderStatus.paused:
    // case workOrderStatus.cancelled:
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
    case workOrderStatus.readyToInvoice:
    case workOrderStatus.walkthroughCompleted:
      return true;
    default:
      return false;
  }
};

export const newestToOldest = (a, b) => {
  const DATE_FORMAT = 'MM/DD/YY';

  return (
    moment(a.scheduledDate, DATE_FORMAT) < moment(b.scheduledDate, DATE_FORMAT)
  );
};

export const WORK_ORDER_FILTER = {
  APPROVE_PAYMENT: 'approve payment',
  FAILED_PAYMENT: 'failed payment',
  BOOKED_NOT_APPROVE_AND_NOT_FAILED: 'booked',
  NOT_BOOKED_NOT_APPROVE_AND_NOT_FAILED: 'not booked',
  PAUSED: 'paused',
};

export const filterWorkOrdersFor = (filter, workOrders = []) => {
  let filteredWorkOrders = [];
  switch (filter) {
    case WORK_ORDER_FILTER.APPROVE_PAYMENT:
      filteredWorkOrders = workOrders.filter((w) => {
        return w.status === workOrderStatus.invoiceSentToCustomer;
      });
      break;
    case WORK_ORDER_FILTER.FAILED_PAYMENT:
      filteredWorkOrders = workOrders.filter((w) => {
        return w.status === workOrderStatus.paymentFailed;
      });
      break;
    case WORK_ORDER_FILTER.BOOKED_NOT_APPROVE_AND_NOT_FAILED:
      filteredWorkOrders = workOrders.filter(
        (w) =>
          workOrderStatusLabels[w.status] === 'Scheduled' &&
          w.status !== workOrderStatus.paymentFailed &&
          w.status !== workOrderStatus.invoiceSentToCustomer &&
          w.status !== workOrderStatus.paused
      );
      break;
    case WORK_ORDER_FILTER.NOT_BOOKED_NOT_APPROVE_AND_NOT_FAILED:
      filteredWorkOrders = workOrders.filter((w) => {
        return (
          workOrderStatusLabels[w.status] === 'Initiated' &&
          w.status !== workOrderStatus.paymentFailed &&
          w.status !== workOrderStatus.invoiceSentToCustomer &&
          w.status !== workOrderStatus.paused
        );
      });
      break;
    case WORK_ORDER_FILTER.PAUSED:
      filteredWorkOrders = workOrders.filter((w) => {
        return w.status === workOrderStatus.paused;
      });
      break;
  }
  return filteredWorkOrders;
};
