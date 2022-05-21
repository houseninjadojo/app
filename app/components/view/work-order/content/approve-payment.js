import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { ActionSheet, ActionSheetButtonStyle } from '@capacitor/action-sheet';
import { captureException } from 'houseninja/utils/sentry';
import isNativePlatform from 'houseninja/utils/is-native-platform';
import { NATIVE_MOBILE_ROUTE } from 'houseninja/data/enums/routes';

export default class WorkOrderApprovePaymentViewContentComponent extends Component {
  @service router;
  @service store;

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
    const total = this.args.model.invoice.get('formattedTotal');
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
      invoice: this.invoice,
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
      const isValid = await this.cvcResourceVerification();
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
  selectRoute() {
    this.isProcessing = false;
    this.args.model.reload();
    this.router.transitionTo(NATIVE_MOBILE_ROUTE.DASHBOARD.HOME);
  }

  @action
  closeWindow() {
    window.close();
  }

  async cvcResourceVerification() {
    try {
      const creditCard = this.store.peekAll('credit-card').firstObject;
      const verification = await this.store.createRecord(
        'resource-verification',
        {
          resourceName: 'credit-card',
          recordId: creditCard?.id,
          attribute: 'cvv',
          // value: this.cvc,
          vgsValue: this.cvc,
        }
      );
      verification.save();
      return true;
    } catch (e) {
      captureException(e);
      return false;
    }
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
