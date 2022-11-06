import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { WorkOrderStatus as Status } from 'houseninja/data/work-order-status';
import { NATIVE_MOBILE_ROUTE } from 'houseninja/data/enums/routes';

import WorkOrder from 'houseninja/models/work-order';
import IntercomService from 'houseninja/services/intercom';
import RouterService from '@ember/routing/router-service';
import LoaderService from 'houseninja/services/loader';
import ViewService from 'houseninja/services/view';

enum ContentType {
  ApprovePayment = 'approve-payment',
  ApproveEstimate = 'approve-estimate',
  Scheduling = 'scheduling',
  Closed = 'closed',
  Default = 'default',
}

type Args = {
  model: WorkOrder;
};

export default class WorkOrderViewComponent extends Component<Args> {
  @service declare loader: LoaderService;
  @service declare intercom: IntercomService;
  @service declare router: RouterService;
  @service declare view: ViewService;

  paymentRoute: string = NATIVE_MOBILE_ROUTE.SETTINGS.PAYMENT;
  issueMessage = `I have a question about the ${this.args.model?.description} service request.`;

  get isLoading(): boolean {
    return this.loader.isLoading;
  }

  get contentType(): string {
    const status = this.args.model?.status ?? '';
    switch (status) {
      case Status.InvoiceSentToCustomer:
      case Status.PaymentFailed:
        return ContentType.ApprovePayment;
      case Status.EstimateSharedWithHomeowner:
        return ContentType.ApproveEstimate;
      case Status.SchedulingInProgress:
        return ContentType.Scheduling;
      case Status.InvoicePaidByCustomer:
      case Status.Closed:
        return ContentType.Closed;
      default:
        return ContentType.Default;
    }
  }

  @action
  selectRoute(route: string | WorkOrder): void {
    if (route instanceof WorkOrder) {
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
