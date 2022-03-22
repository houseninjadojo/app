import {
  workOrderStatus,
  workOrderStatusLabels,
} from 'houseninja/data/work-order-status';

export const getWorkOrderTag = (status) => {
  switch (status) {
    case workOrderStatus.invoicePaidByCustomer:
    case workOrderStatus.closed:
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
    case workOrderStatus.workOrderInititated:
    case workOrderStatus.workScheduled:
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
