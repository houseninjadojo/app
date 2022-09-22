import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { WorkOrderStatus } from 'houseninja/data/work-order-status';
import { classify } from '@ember/string';
import { NATIVE_MOBILE_ROUTE } from 'houseninja/data/enums/routes';

enum Content {
  ApprovePayment = 'approve-payment',
  PaymentFailed = 'failed-payment',
  // approveEstimate: 'approve-estimate',
  Closed = 'closed',
  Default = 'default',
}

interface WorkOrder {
  model: { description: string; status: keyof typeof WorkOrderStatus };
}

export default class WorkOrderViewComponent extends Component<WorkOrder> {
  @service declare loader: any;
  @service declare intercom: any;
  @service declare router: any;
  @service declare view: any;

  paymentRoute = NATIVE_MOBILE_ROUTE.SETTINGS.PAYMENT;
  issueMessage = `I have a question about the ${this.args.model?.description} service request.`;

  get isLoading(): boolean {
    return this.loader.isLoading;
  }

  get contentType(): Content {
    const modelStatus: string =
      this.args.model?.status && classify(this.args.model.status);
    const status: WorkOrderStatus =
      WorkOrderStatus[modelStatus as keyof typeof WorkOrderStatus];
    console.log('modelStatus', modelStatus);
    console.log('status', status);

    switch (status) {
      case WorkOrderStatus.InvoiceSentToCustomer:
        return Content.ApprovePayment;
      case WorkOrderStatus.PaymentFailed:
        // return Content.paymentFailed;
        return Content.ApprovePayment;
      // case WorkOrderStatus.EstimateSharedWithHomeowner:
      //   return Content.approveEstimate;
      case WorkOrderStatus.InvoicePaidByCustomer:
      case WorkOrderStatus.Closed:
        return Content.Closed;
      default:
        return Content.Default;
    }
  }

  @action
  selectRoute(route: string | { id: string }): void {
    if (typeof route === 'object') {
      this.router.transitionTo(NATIVE_MOBILE_ROUTE.WORK_ORDERS.SHOW, route.id);
    } else {
      if (route === this.paymentRoute) {
        this.view.preservePreviousRoute(this.router);
      }
      this.router.transitionTo(route);
    }
  }

  @action
  async displayMessageComposer(message: string): Promise<void> {
    this.intercom.showComposer(message);
  }
}
