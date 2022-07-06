import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { workOrderStatus } from 'houseninja/data/work-order-status';
import { camelize } from '@ember/string';
import { NATIVE_MOBILE_ROUTE } from 'houseninja/data/enums/routes';

export default class WorkOrderViewComponent extends Component {
  @service loader;
  @service intercom;
  @service router;
  @service view;

  paymentRoute = NATIVE_MOBILE_ROUTE.SETTINGS.PAYMENT;
  issueMessage = `I have a question about the ${this.args.model.description} service request.`;

  content = {
    approvePayment: 'approve-payment',
    paymentFailed: 'failed-payment',
    // approveEstimate: 'approve-estimate',
    closed: 'closed',
    default: 'default',
  };

  get isLoading() {
    return this.loader.isLoading;
  }

  get contentType() {
    const modelStatus = this.args.model?.status ?? '';
    const status = workOrderStatus[camelize(modelStatus)];
    switch (status) {
      case workOrderStatus.invoiceSentToCustomer:
        return this.content.approvePayment;
      case workOrderStatus.paymentFailed:
        return this.content.paymentFailed;
      // case workOrderStatus.estimateSharedWithHomeowner:
      //   return this.content.approveEstimate;
      case workOrderStatus.invoicePaidByCustomer:
      case workOrderStatus.closed:
        return this.content.closed;
      default:
        return this.content.default;
    }
  }

  @action
  selectRoute(route) {
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
  async displayMessageComposer(message) {
    this.intercom.showComposer(message);
  }
}
