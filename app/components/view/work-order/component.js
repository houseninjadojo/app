import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { Intercom } from '@capacitor-community/intercom';
import { workOrderStatus } from 'houseninja/data/work-order-status';
import { toCamel } from 'houseninja/utils/string-helpers';
import { ActionSheet, ActionSheetButtonStyle } from '@capacitor/action-sheet';

export default class WorkOrderViewComponent extends Component {
  @service router;
  @service view;
  @service intercom;

  cancelMessage = 'I would like to cancel this work order.';
  issueMessage = 'I have an issue with my work order.';

  content = {
    approvePayment: 'ApprovePayment',
    paymentFailed: 'FailedPayment',
    closed: 'Closed',
    default: 'Default',
  };

  actionSheetOptions = [
    {
      title: 'Dismiss',
      style: ActionSheetButtonStyle.Cancel,
    },
    {
      title: 'I approve this payment',
    },
  ];

  get contentType() {
    const status = workOrderStatus[toCamel(this.args.model.status)];
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
      this.router.transitionTo(`work-order`, route.id);
    } else {
      if (route === 'settings.payment') {
        this.view.preservePreviousRoute(this.router);
      }
      this.router.transitionTo(route);
    }
  }

  @action
  async displayMessageComposer(message) {
    await Intercom.displayMessageComposer({ message });
  }
  @action
  async handlePaymentApproval() {
    let result = await this.confirm();
    let choice = this.actionSheetOptions[result.index].title;
    let userApproves = choice === this.actionSheetOptions[1].title;

    if (userApproves) {
      console.log('Processing payment');
    }
  }

  async confirm() {
    const result = await ActionSheet.showActions({
      title: 'Amount Due $999',
      message: 'Do you approve this payment?',
      options: this.actionSheetOptions,
    });
    return result;
  }
}
