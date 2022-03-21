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
        label: workOrderStatusLabels[status],
        type: 'accent',
      };
    case workOrderStatus.paymentFailed:
      return {
        label: workOrderStatusLabels[status],
        type: 'alert',
      };
    case workOrderStatus.workOrderInititated:
    case workOrderStatus.workScheduled:
    default:
      return {
        label: workOrderStatusLabels[status],
        // type: null,
      };
  }
};
