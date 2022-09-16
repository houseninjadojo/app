import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { ActionSheet, ActionSheetButtonStyle } from '@capacitor/action-sheet';
import { captureException } from 'houseninja/utils/sentry';
import isNativePlatform from 'houseninja/utils/is-native-platform';
import { NATIVE_MOBILE_ROUTE } from 'houseninja/data/enums/routes';

// const cardsStub = [
//   {
//     id: 'asdf',
//     cardBrand: 'TEST MASTERCARD',
//     lastFour: '9999',
//   },
//   {
//     id: 'zxcv',
//     cardBrand: 'TEST VISA',
//     lastFour: '8888',
//   },
//   {
//     id: 'qwer',
//     cardBrand: 'TEST CARD',
//     lastFour: '7777',
//     isDefault: true,
//   },
// ];

export default class WorkOrderApprovePaymentViewContentComponent extends Component {
  @service intercom;
  @service router;
  @service store;
  @service toast;

  @tracked showWebDialog = false;
  @tracked isProcessing = false;
  @tracked isDoneProcessing = false;
  @tracked paid = false;
  @tracked creditCard = this.allPaymentMethods().filter((c) => c.isDefault)[0];

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
  async approvePayment() {
    this.toggleIsProcessing();

    const payment = this.store.createRecord('payment', {
      invoice: this.invoice,
      paymentMethod: this.creditCard,
    });

    try {
      await payment.save(); // this will be long running (probably)
      this.paid = true;
    } catch (e) {
      if (!this.payment) {
        const hasGenericError =
          payment.errors?.messages.filter((e) => e.attribute === null).length >
          0;

        if (hasGenericError) {
          this.toast.showError(
            'Your payment was unsuccessful. If this happens again, please contact us at hello@houseninja.co.'
          );
        }

        this.toggleIsProcessing();
      }

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
  inquireAboutInvoice() {
    this.intercom.showComposer(
      `I have a question about the invoice for the ${this.args.model?.description} service request.`
    );
  }

  @action
  selectRoute() {
    this.isProcessing = false;
    this.args.model.reload();
    this.router.transitionTo(NATIVE_MOBILE_ROUTE.DASHBOARD.HOME);
  }

  @action
  handlePaymentMethodChange(e) {
    this.creditCard = this.allPaymentMethods().filter(
      (c) => c.id === e.target.value
    )[0];
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

  allPaymentMethods() {
    return this.args.model.get('property.user.paymentMethods');
  }

  get paymentMethodSelectConfig() {
    const allCards = this.allPaymentMethods();
    const mappedCards = allCards?.map((c) => {
      return {
        value: c.id,
        label: `${c.cardBrand ? c.cardBrand.toUpperCase() : 'Card'} ending in ${
          c.lastFour
        } ${c.isDefault ? '(default) ' : ''}`,
        selected: c.isDefault,
      };
    });

    return {
      id: 'payment-methods',
      label: 'Payment Method',
      options: mappedCards || [],
    };
  }
}
