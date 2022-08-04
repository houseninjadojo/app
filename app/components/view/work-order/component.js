import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { workOrderStatus } from 'houseninja/data/work-order-status';
import { camelize } from '@ember/string';
import { NATIVE_MOBILE_ROUTE } from 'houseninja/data/enums/routes';

const WORK_ORDER_VIEW_CONTENT = {
  APPROVE_PAYMENT: 'approve-payment',
  APPROVE_ESTIMATE: 'approve-estimate',
  CLOSED: 'closed',
  DEFAULT: 'default',
};

export default class WorkOrderViewComponent extends Component {
  @service loader;
  @service intercom;
  @service router;
  @service view;

  paymentRoute = NATIVE_MOBILE_ROUTE.SETTINGS.PAYMENT;
  issueMessage = `I have a question about the ${this.args.model?.description} service request.`;

  get isLoading() {
    return this.loader.isLoading;
  }

  get contentType() {
    const modelStatus = this.args.model?.status ?? '';
    const status = workOrderStatus[camelize(modelStatus)];
    switch (status) {
      case workOrderStatus.invoiceSentToCustomer:
      case workOrderStatus.paymentFailed:
        return WORK_ORDER_VIEW_CONTENT.APPROVE_PAYMENT;
      case workOrderStatus.estimateSharedWithHomeowner:
        return WORK_ORDER_VIEW_CONTENT.APPROVE_ESTIMATE;
      case workOrderStatus.invoicePaidByCustomer:
      case workOrderStatus.closed:
        return WORK_ORDER_VIEW_CONTENT.CLOSED;
      default:
        return WORK_ORDER_VIEW_CONTENT.DEFAULT;
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
