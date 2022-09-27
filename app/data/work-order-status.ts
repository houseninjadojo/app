export enum WorkOrderStatus {
  WorkRequestReceived = 'work_request_received',
  WorkOrderInitiated = 'work_order_initiated',
  VendorIdentified = 'vendor_identified',
  SchedulingInProgress = 'scheduling_in_progress',
  OnsiteEstimateScheduled = 'onsite_estimate_scheduled',
  EstimateSharedWithHomeowner = 'estimate_shared_with_homeowner',
  EstimateApproved = 'estimate_approved',
  EstimateNotApproved = 'estimate_not_approved',
  WorkScheduled = 'work_scheduled',
  WorkInProgress = 'work_in_progress',
  ChangeOrderReceived = 'change_order_received',
  WorkCompleted = 'work_completed',
  ProblemReported = 'problem_reported',
  ProblemBeingAddressed = 'problem_being_addressed',
  ProblemResolved = 'problem_resolved',
  VendorInvoiceReceived = 'vendor_invoice_received',
  ReadyToInvoiceCustomer = 'ready_to_invoice_customer',
  InvoiceSentToCustomer = 'invoice_sent_to_customer',
  InvoicePaidByCustomer = 'invoice_paid_by_customer',
  PaymentFailed = 'payment_failed',
  Closed = 'closed',
  Paused = 'paused',
  Cancelled = 'cancelled',
  Canceled = 'canceled',
  // Referred = 'referred',
  HomeWalkthroughScheduled = 'home_walkthrough_scheduled',
  WalkthroughCompleted = 'walkthrough_completed',
  WalkthroughReportSent = 'walkthrough_report_sent',
}
export enum WorkOrderUILabel {
  Initiated = 'Initiated',
  Estimate = 'Estimate for Review',
  Scheduling = 'Scheduling in Progress',
  Scheduled = 'Scheduled',
  Completed = 'Completed',
  PaymentDue = 'Payment Due',
  Canceled = 'Canceled',
  Paused = 'Paused',
  Paid = 'Paid',
  Closed = 'Closed',
}

export const WorkOrderStatusLabel = {
  [WorkOrderStatus.WorkRequestReceived]: WorkOrderUILabel.Initiated,
  [WorkOrderStatus.WorkOrderInitiated]: WorkOrderUILabel.Initiated,
  [WorkOrderStatus.VendorIdentified]: WorkOrderUILabel.Initiated,
  [WorkOrderStatus.OnsiteEstimateScheduled]: WorkOrderUILabel.Initiated,
  [WorkOrderStatus.SchedulingInProgress]: WorkOrderUILabel.Scheduling,
  // [WorkOrderStatus.EstimateSharedWithHomeowner]: 'Approve Estimate',
  [WorkOrderStatus.EstimateSharedWithHomeowner]: WorkOrderUILabel.Estimate,
  [WorkOrderStatus.EstimateApproved]: WorkOrderUILabel.Initiated,
  [WorkOrderStatus.EstimateNotApproved]: WorkOrderUILabel.Initiated,
  [WorkOrderStatus.WorkScheduled]: WorkOrderUILabel.Scheduled,
  [WorkOrderStatus.WorkInProgress]: WorkOrderUILabel.Scheduled,
  [WorkOrderStatus.ChangeOrderReceived]: WorkOrderUILabel.Scheduled,
  [WorkOrderStatus.WorkCompleted]: WorkOrderUILabel.Completed,
  [WorkOrderStatus.ProblemReported]: WorkOrderUILabel.Completed,
  [WorkOrderStatus.ProblemBeingAddressed]: WorkOrderUILabel.Completed,
  [WorkOrderStatus.ProblemResolved]: WorkOrderUILabel.Completed,
  [WorkOrderStatus.VendorInvoiceReceived]: WorkOrderUILabel.Completed,
  [WorkOrderStatus.ReadyToInvoiceCustomer]: WorkOrderUILabel.Completed,
  [WorkOrderStatus.InvoiceSentToCustomer]: WorkOrderUILabel.PaymentDue,
  // [WorkOrderStatus.invoicePaidByCustomer]: 'Review Vendor', // For when review feature is developed.
  [WorkOrderStatus.InvoicePaidByCustomer]: WorkOrderUILabel.Paid,
  // [WorkOrderStatus.paymentFailed]: 'Payment Failed',
  [WorkOrderStatus.PaymentFailed]: WorkOrderUILabel.PaymentDue,
  [WorkOrderStatus.Closed]: WorkOrderUILabel.Closed,
  [WorkOrderStatus.Paused]: WorkOrderUILabel.Paused,
  [WorkOrderStatus.Cancelled]: WorkOrderUILabel.Canceled,
  [WorkOrderStatus.Canceled]: WorkOrderUILabel.Canceled,
  // [WorkOrderStatus.referred]: 'Referred',
  [WorkOrderStatus.HomeWalkthroughScheduled]: WorkOrderUILabel.Scheduled,
  // [WorkOrderStatus.walkthroughCompleted]: 'Creating Report',
  [WorkOrderStatus.WalkthroughReportSent]: WorkOrderUILabel.Completed,
} as const;
// export type WorkOrderStatusLabel = keyof typeof WorkOrderStatusLabel;
export type WorkOrderStatusLabel = keyof typeof WorkOrderStatusLabel;

// export enum WorkOrderStatusLabel {
//   WorkOrderStatus.WorkRequestReceived = WorkOrderUILabel.Initiated,
//   WorkOrderInitiated = WorkOrderUILabel.Initiated,
//   VendorIdentified = WorkOrderUILabel.Initiated,
//   SchedulingInProgress = WorkOrderUILabel.Initiated,
//   OnsiteEstimateScheduled = WorkOrderUILabel.Initiated,
//   // EstimateSharedWithHomeowner = 'Approve Estimate',
//   EstimateSharedWithHomeowner = WorkOrderUILabel.Estimate,
//   EstimateApproved = WorkOrderUILabel.Initiated,
//   EstimateNotApproved = WorkOrderUILabel.Initiated,
//   WorkScheduled = WorkOrderUILabel.Scheduled,
//   WorkInProgress = WorkOrderUILabel.Scheduled,
//   ChangeOrderReceived = WorkOrderUILabel.Scheduled,
//   WorkCompleted = WorkOrderUILabel.Completed,
//   ProblemReported = WorkOrderUILabel.Completed,
//   ProblemBeingAddressed = WorkOrderUILabel.Completed,
//   ProblemResolved = WorkOrderUILabel.Completed,
//   VendorInvoiceReceived = WorkOrderUILabel.Completed,
//   ReadyToInvoiceCustomer = WorkOrderUILabel.Completed,
//   InvoiceSentToCustomer = WorkOrderUILabel.PaymentDue,
//   // InvoicePaidByCustomer = 'Review Vendor', // For when review feature is developed.
//   InvoicePaidByCustomer = WorkOrderUILabel.Paid,
//   // PaymentFailed = 'Payment Failed',
//   PaymentFailed = WorkOrderUILabel.PaymentDue,
//   Closed = WorkOrderUILabel.Closed,
//   Paused = WorkOrderUILabel.Paused,
//   Cancelled = WorkOrderUILabel.Canceled,
//   Canceled = WorkOrderUILabel.Canceled,
//   // Referred = 'Referred',
//   HomeWalkthroughScheduled = WorkOrderUILabel.Scheduled,
//   // WalkthroughCompleted = 'Creating Report',
//   WalkthroughReportSent = WorkOrderUILabel.Completed,
// }
