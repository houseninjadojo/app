export const workOrderStatus = {
  workRequestReceived: 'work_request_received',
  workOrderInitiated: 'work_order_initiated',
  vendorIdentified: 'vendor_identified',
  schedulingInProgress: 'scheduling_in_progress',
  onsiteEstimateScheduled: 'onsite_estimate_scheduled',
  estimateSharedWithHomeowner: 'estimate_shared_with_homeowner',
  estimateApproved: 'estimate_approved',
  estimateNotApproved: 'estimate_not_approved',
  workScheduled: 'work_scheduled',
  workInProgress: 'work_in_progress',
  changeOrderReceived: 'change_order_received',
  workCompleted: 'work_completed',
  customerConfirmedWork: 'customer_confirmed_work',
  problemReported: 'problem_reported',
  problemBeingAddressed: 'problem_being_addressed',
  problemResolved: 'problem_resolved',
  vendorInvoiceReceived: 'vendor_invoice_received',
  invoiceSentToCustomer: 'invoice_sent_to_customer',
  invoicePaidByCustomer: 'invoice_paid_by_customer',
  paymentFailed: 'payment_failed',
  closed: 'closed',
  paused: 'paused',
  cancelled: 'cancelled',
};

export const workOrderStatusLabels = {
  [workOrderStatus.workRequestReceived]: '',
  [workOrderStatus.workOrderInitiated]: 'Initiated',
  [workOrderStatus.vendorIdentified]: 'Initiated',
  [workOrderStatus.schedulingInProgress]: 'Initiated',
  [workOrderStatus.onsiteEstimateScheduled]: 'Initiated',
  [workOrderStatus.estimateSharedWithHomeowner]: 'Initiated',
  [workOrderStatus.estimateApproved]: 'Initiated',
  [workOrderStatus.estimateNotApproved]: 'Initiated',
  [workOrderStatus.workScheduled]: 'Scheduled',
  [workOrderStatus.workInProgress]: 'Scheduled',
  [workOrderStatus.changeOrderReceived]: 'Scheduled',
  [workOrderStatus.workCompleted]: 'Completed',
  [workOrderStatus.customerConfirmedWork]: 'Completed',
  [workOrderStatus.problemReported]: 'Completed',
  [workOrderStatus.problemBeingAddressed]: 'Completed',
  [workOrderStatus.problemResolved]: 'Completed',
  [workOrderStatus.vendorInvoiceReceived]: 'Completed',
  [workOrderStatus.invoiceSentToCustomer]: 'Payment Due',
  // [workOrderStatus.invoicePaidByCustomer]: 'Review Vendor', // For when review feature is developed.
  [workOrderStatus.invoicePaidByCustomer]: 'Paid',
  [workOrderStatus.paymentFailed]: 'Payment Failed',
  [workOrderStatus.closed]: 'Completed',
  [workOrderStatus.paused]: 'Paused',
  [workOrderStatus.cancelled]: 'Cancelled',
};
