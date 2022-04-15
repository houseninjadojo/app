import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { Intercom } from '@capacitor-community/intercom';
import { workOrderStatus } from 'houseninja/data/work-order-status';
import { camelize } from '@ember/string';
import { NATIVE_MOBILE_ROUTE } from 'houseninja/data/enums/routes';

export default class WorkOrderViewComponent extends Component {
  @service router;
  @service view;
  @service intercom;

  paymentRoute = NATIVE_MOBILE_ROUTE.SETTINGS.PAYMENT;

  cancelMessage = 'I would like to cancel this work order.';
  issueMessage = 'I have an issue with my work order.';

  content = {
    approvePayment: 'approve-payment',
    paymentFailed: 'failed-payment',
    closed: 'closed',
    default: 'default',
  };

  get contentType() {
    const modelStatus = this.args.model?.get('status') ?? '';
    const status = workOrderStatus[camelize(modelStatus)];
    switch (status) {
      case workOrderStatus.invoiceSentToCustomer:
        return this.content.approvePayment;
      case workOrderStatus.paymentFailed:
        return this.content.paymentFailed;
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
    await Intercom.displayMessageComposer({ message });
  }
}
