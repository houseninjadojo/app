import {
  workOrderStatus,
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
      return {
        label: getWorkOrderStatusLabel(status),
        type: 'alert',
      };
    case workOrderStatus.invoiceSentToCustomer:
      return {
        label: getWorkOrderStatusLabel(status),
        type: 'accent',
      };
    case workOrderStatus.vendorInvoiceReceived:
    case workOrderStatus.problemResolved:
    case workOrderStatus.problemBeingAddressed:
    case workOrderStatus.customerConfirmedWork:
    case workOrderStatus.problemReported:
    case workOrderStatus.workCompleted:
      return {
        label: getWorkOrderStatusLabel(status),
        type: 'accent-outline',
      };
    case workOrderStatus.changeOrderReceived:
    case workOrderStatus.workInProgress:
    case workOrderStatus.workScheduled:
      return {
        label: getWorkOrderStatusLabel(status),
        type: 'primary',
      };
    case workOrderStatus.estimateSharedWithHomeowner:
      return {
        label: getWorkOrderStatusLabel(status),
        type: 'secondary-outline',
      };
    case workOrderStatus.estimateNotApproved:
    case workOrderStatus.estimateApproved:
    case workOrderStatus.onsiteEstimateScheduled:
    case workOrderStatus.schedulingInProgress:
    case workOrderStatus.vendorIdentified:
    case workOrderStatus.workOrderInititated:
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
