import {
  workOrderStatus,
  workOrderStatusLabels,
} from 'houseninja/data/work-order-status';

export const getWorkOrderTag = (status) => {
  switch (status) {
    case workOrderStatus.invoicePaidByCustomer:
      // For when the review feature is developed.
      // return {
      //   label: getWorkOrderStatusLabel(status),
      //   type: 'accent',
      // };
      return;
    case workOrderStatus.closed:
    case workOrderStatus.cancelled:
      return;
    case workOrderStatus.invoiceSentToCustomer:
      return {
        label: getWorkOrderStatusLabel(status),
        type: 'accent',
      };
    case workOrderStatus.paymentFailed:
      return {
        label: getWorkOrderStatusLabel(status),
        type: 'alert',
      };
    case workOrderStatus.workScheduled:
    case workOrderStatus.workInProgress:
    case workOrderStatus.changeOrderReceived:
    case workOrderStatus.workCompleted:
    case workOrderStatus.customerConfirmedWork:
    case workOrderStatus.problemReported:
    case workOrderStatus.problemBeingAddressed:
    case workOrderStatus.problemResolved:
    case workOrderStatus.vendorInvoiceReceived:
      return {
        label: getWorkOrderStatusLabel(status),
        type: 'primary',
      };
    case workOrderStatus.paused:
      return {
        label: getWorkOrderStatusLabel(status),
        type: 'disabled',
      };
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
