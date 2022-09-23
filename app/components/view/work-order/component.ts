import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { WorkOrderStatus } from 'houseninja/data/work-order-status';
import { NATIVE_MOBILE_ROUTE } from 'houseninja/data/enums/routes';

import WorkOrder from 'houseninja/models/work-order';
import IntercomService from 'houseninja/services/intercom';
import RouterService from '@ember/routing/router-service';

enum WorkOrderViewContent {
  ApprovePayment = 'approve-payment',
  ApproveEstimate = 'approve-estimate',
  Closed = 'closed',
  Default = 'default',
}

type Args = {
  model: WorkOrder;
};

export default class WorkOrderViewComponent extends Component<Args> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @service declare loader: any;
  @service declare intercom: IntercomService;
  @service declare router: RouterService;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @service declare view: any;

  paymentRoute: string = NATIVE_MOBILE_ROUTE.SETTINGS.PAYMENT;
  issueMessage = `I have a question about the ${this.args.model?.description} service request.`;

  get isLoading() {
    return this.loader.isLoading;
  }

  get contentType(): string {
    const status = this.args.model?.status ?? '';
    switch (status) {
      case WorkOrderStatus.InvoiceSentToCustomer:
      case WorkOrderStatus.PaymentFailed:
        return WorkOrderViewContent.ApprovePayment;
      case WorkOrderStatus.EstimateSharedWithHomeowner:
        return WorkOrderViewContent.ApproveEstimate;
      case WorkOrderStatus.InvoicePaidByCustomer:
      case WorkOrderStatus.Closed:
        return WorkOrderViewContent.Closed;
      default:
        return WorkOrderViewContent.Default;
    }
  }

  @action
  selectRoute(route: string | WorkOrder): void {
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
    await this.intercom.showComposer(message);
  }
}
