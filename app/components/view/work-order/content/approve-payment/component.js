import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { ActionSheet, ActionSheetButtonStyle } from '@capacitor/action-sheet';
import { captureException } from 'houseninja/utils/sentry';
import isNativePlatform from 'houseninja/utils/is-native-platform';
import { NATIVE_MOBILE_ROUTE } from 'houseninja/data/enums/routes';

export default class WorkOrderApprovePaymentViewContentComponent extends Component {
  @service intercom;
  @service router;
  @service store;

  @tracked showWebDialog = false;
  @tracked isProcessing = false;
  @tracked isDoneProcessing = false;
  @tracked paid = false;
  @tracked paymentFailed = false;

  actionSheetOptions = [
    {
      title: 'Dismiss',
      style: ActionSheetButtonStyle.Cancel,
    },
    {
      title: 'I approve this payment',
    },
  ];

  async _nativeConfirmation() {
    const total = this.args.model.get('invoice.formattedTotal');
    const result = await ActionSheet.showActions({
      title: `Amount Due ${total}`,
      message: 'Do you approve this payment?',
      options: this.actionSheetOptions,
    });

    const choice = this.actionSheetOptions[result.index].title;
    const confirmed = choice === this.actionSheetOptions[1].title;
    if (confirmed) {
      await this.approvePayment();
    }
  }

  _webConfirmation() {
    this.toggleWebDialog();
  }

  @action
  toggleIsProcessing() {
    this.isProcessing = !this.isProcessing;
  }

  @action
  async approvePayment(isWeb = false) {
    this.toggleIsProcessing();

    const payment = this.store.createRecord('payment', {
      invoice: this.invoice,
    });

    try {
      await payment.save(); // this will be long running (probably)
      this.paid = true;
      isWeb && this.toggleWebDialog();
    } catch (e) {
      this.paymentFailed = true;
      isWeb && this.toggleWebDialog();
      captureException(e);
    }
  }

  @action
  toggleWebDialog() {
    this.showWebDialog = !this.showWebDialog;
  }

  @action
  async confirm() {
    if (isNativePlatform()) {
      this._nativeConfirmation();
    } else {
      this._webConfirmation();
    }
  }

  @action
  requestDifferentPayment() {
    this.intercom.showComposer('I would like to update my payment method.');
  }

  @action
  inquireAboutInvoice() {
    this.intercom.showComposer(
      `I have a question about the invoice for the ${this.args.model.description} service request.`
    );
  }

  @action
  selectRoute() {
    this.isProcessing = false;
    this.args.model.reload();
    this.router.transitionTo(NATIVE_MOBILE_ROUTE.DASHBOARD.HOME);
  }

  get isNativePlatform() {
    return isNativePlatform();
  }

  get invoice() {
    return this.args.model.invoice;
  }

  get formattedTotal() {
    return this.invoice?.formattedTotal;
  }

  get creditCard() {
    return this.store.peekAll('credit-card').firstObject;
  }
}
