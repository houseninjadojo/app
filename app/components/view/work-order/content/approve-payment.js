import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { ActionSheet, ActionSheetButtonStyle } from '@capacitor/action-sheet';
import { captureException } from 'houseninja/utils/sentry';
import isNativePlatform from 'houseninja/utils/is-native-platform';

export default class ApprovePaymentComponent extends Component {
  @tracked cvc = null;
  @tracked showWebDialog = false;
  @tracked isProcessing = false;
  @tracked isDoneProcessing = false;
  @tracked paid = false;
  @tracked cvcError = [];

  actionSheetOptions = [
    {
      title: 'Dismiss',
      style: ActionSheetButtonStyle.Cancel,
    },
    {
      title: 'I approve this payment',
    },
  ];

  get isNativePlatform() {
    return isNativePlatform();
  }

  async _nativeConfirmation() {
    console.log(this.args.model);
    const total = await this.args.model.formattedTotal;
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
    this.toggleModal();
  }

  async approvePayment(isWeb = false) {
    this.isProcessing = true;

    const payment = this.store.createRecord('payment', {
      invoice: this.args.model.invoice,
    });

    try {
      await payment.save(); // this will be long running (probably)
      this.isDoneProcessing = true;
      this.paid = true;
      isWeb && this.toggleModal();
    } catch (e) {
      this.isProcessing = false;
      this.cvcError = [
        {
          message:
            'There was an error approving your payment. Please try again in a few minutes.',
        },
      ];
      captureException(e);
    }
  }

  @action
  toggleModal() {
    this.showWebDialog = !this.showWebDialog;
  }

  @action
  async validateCVC() {
    if (this.cvc) {
      const isValid = await this.cvcResourseVerification();
      if (isValid) {
        this.cvcError = [];
        this.approvePayment(true);
      } else {
        this.cvcError = [{ message: 'Invalid CVC code' }];
      }
    } else {
      this.cvcError = [
        { message: 'Please enter the CVC number associated with this card.' },
      ];
    }
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
  gotIt() {
    this.isProcessing = false;
    this.updateWorkOrderStatus(true);
  }

  @action
  closeWindow() {
    window.close();
  }

  async cvcResourseVerification() {
    try {
      const verification = await this.store
        .createRecord('resource-verification', {
          resourceName: 'credit-card',
          recordId: this.args.model.paymentMethod.id,
          attribute: 'cvv',
          // value: this.cvc,
          vgsValue: this.cvc,
        })
        .save();
      return verification.result;
    } catch {
      return false;
    }
  }
}
