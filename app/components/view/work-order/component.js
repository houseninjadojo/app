import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { Intercom } from '@capacitor-community/intercom';
import { workOrderStatus } from 'houseninja/data/work-order-status';
import { toCamel } from 'houseninja/utils/string-helpers';
import { NATIVE_MOBILE_ROUTE } from 'houseninja/data/enums/routes';

export default class WorkOrderViewComponent extends Component {
  @service loader;
  @service intercom;
  @service router;
  @service view;

  paymentRoute = NATIVE_MOBILE_ROUTE.SETTINGS.PAYMENT;

  cancelMessage = 'I would like to cancel this work order.';
  issueMessage = 'I have an issue with my work order.';

  content = {
    approvePayment: 'ApprovePayment',
    paymentFailed: 'FailedPayment',
    approveEstimate: 'ApproveEstimate',
    closed: 'Closed',
    default: 'Default',
  };

  get isLoading() {
    return this.loader.isLoading;
  }

  get contentType() {
    const status = workOrderStatus[toCamel(this.args.model?.status)];
    switch (status) {
      case workOrderStatus.invoiceSentToCustomer:
        return this.content.approvePayment;
      case workOrderStatus.paymentFailed:
        return this.content.paymentFailed;
      case workOrderStatus.estimateSharedWithHomeowner:
        return this.content.approveEstimate;
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
      this.router.transitionTo(NATIVE_MOBILE_ROUTE.WORK_ORDER, route.id);
    } else {
      if (route === this.paymentRoute) {
        this.view.preservePreviousRoute(this.router);
      }
      this.router.transitionTo(route);
    }
  }

  @action
  async displayMessageComposer(message) {
    await Intercom.displayMessageComposer({ message });
  }
}
