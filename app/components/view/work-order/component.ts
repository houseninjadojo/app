import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { WorkOrderStatus } from 'houseninja/data/work-order-status';
import { SettingsRoute, WorkOrderRoute } from 'houseninja/data/enums/routes';
import { importSync } from '@embroider/macros';

import WorkOrder from 'houseninja/models/work-order';
import IntercomService from 'houseninja/services/intercom';
import RouterService from '@ember/routing/router-service';
import ViewService from 'houseninja/services/view';
import LoaderService from 'houseninja/services/loader';

import ApproveEstimateComponent from './content/approve-estimate/component';
import ApprovePaymentComponent from './content/approve-payment/component';
import ClosedComponent from './content/closed';
import SchedulingComponent from './content/scheduling';
import DefaultComponent from './content/default';

enum WorkOrderViewContent {
  ApprovePayment = 'approve-payment',
  ApproveEstimate = 'approve-estimate',
  Scheduling = 'scheduling',
  Closed = 'closed',
  Default = 'default',
}

export type WorkOrderContentComponent =
  | ApproveEstimateComponent
  | ApprovePaymentComponent
  | ClosedComponent
  | SchedulingComponent
  | DefaultComponent;

type Args = {
  model: WorkOrder;
};

export default class WorkOrderViewComponent extends Component<Args> {
  @service declare loader: LoaderService;
  @service declare intercom: IntercomService;
  @service declare router: RouterService;
  @service declare view: ViewService;

  paymentRoute = SettingsRoute.Payment;
  issueMessage = `I have a question about the ${this.args.model?.description} service request.`;

  get isLoading() {
    return this.loader.isLoading;
  }

  get contentType(): WorkOrderViewContent {
    const status = this.args.model?.status ?? '';
    switch (status) {
      case WorkOrderStatus.InvoiceSentToCustomer:
      case WorkOrderStatus.PaymentFailed:
        return WorkOrderViewContent.ApprovePayment;
      case WorkOrderStatus.EstimateSharedWithHomeowner:
        return WorkOrderViewContent.ApproveEstimate;
      case WorkOrderStatus.SchedulingInProgress:
        return WorkOrderViewContent.Scheduling;
      case WorkOrderStatus.InvoicePaidByCustomer:
      case WorkOrderStatus.Closed:
        return WorkOrderViewContent.Closed;
      default:
        return WorkOrderViewContent.Default;
    }
  }

  get whichComponent(): WorkOrderContentComponent {
    const component = importSync(
      `./${this.contentType}`
    ) as WorkOrderContentComponent;
    return component;
  }

  @action
  selectRoute(route: string | WorkOrder): void {
    if (typeof route === 'object') {
      this.router.transitionTo(WorkOrderRoute.Show, route.id);
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
