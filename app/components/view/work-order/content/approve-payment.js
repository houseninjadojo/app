import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { ActionSheet, ActionSheetButtonStyle } from '@capacitor/action-sheet';
import Sentry from 'houseninja/utils/sentry';
import { workOrderStatus } from 'houseninja/data/work-order-status';

export default class WorkOrderApprovePaymentViewContentComponent extends Component {
  @tracked isProcessing = false;
  @tracked paid = false;

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

  async confirm() {
    const result = await ActionSheet.showActions({
      title: 'Amount Due $999',
      message: 'Do you approve this payment?',
      options: this.actionSheetOptions,
    });
    return result;
  }

  async updateWorkOrderStatus(success) {
    try {
      this.args.model.status = success
        ? workOrderStatus.invoicePaidByCustomer
        : workOrderStatus.paymentFailed;
      await this.args.model.save();
    } catch (e) {
      Sentry.captureException(e);
    }
  }

  @action
  async handlePaymentApproval() {
    const result = await this.confirm();
    const choice = this.actionSheetOptions[result.index].title;
    const userApproves = choice === this.actionSheetOptions[1].title;

    if (userApproves) {
      this.isProcessing = true;
      try {
        const success = Math.random() < 0.5;

        setTimeout(() => {
          if (success) {
            this.paid = success;
          } else {
            this.isProcessing = false;
            this.updateWorkOrderStatus(false);
          }
        }, 1500);
      } catch (e) {
        Sentry.captureException(e);

        setTimeout(() => {
          this.isProcessing = false;
          this.updateWorkOrderStatus(false);
        }, 3000);
      }
    }
  }

  @action
  gotIt() {
    this.isProcessing = false;
    this.updateWorkOrderStatus(true);
  }
}
