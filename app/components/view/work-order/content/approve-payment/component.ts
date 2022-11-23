import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import {
  ActionSheet,
  ActionSheetButton,
  ActionSheetButtonStyle,
} from '@capacitor/action-sheet';
import { captureException } from 'houseninja/utils/sentry';
import isNativePlatform from 'houseninja/utils/is-native-platform';
import { DashboardRoute } from 'houseninja/data/enums/routes';
import IntercomService from 'houseninja/services/intercom';
import RouterService from '@ember/routing/router-service';
import StoreService from 'houseninja/services/store';
import ToastService from 'houseninja/services/toast';
import WorkOrder from 'houseninja/models/work-order';
import { ValidationError } from '@ember-data/adapter/error';
import Invoice from 'houseninja/models/invoice';

import type Property from 'houseninja/models/property';
import type PaymentMethod from 'houseninja/models/payment-method';

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

type Args = {
  model: WorkOrder;
};

export default class WorkOrderApprovePaymentViewContentComponent extends Component<Args> {
  @service declare intercom: IntercomService;
  @service declare router: RouterService;
  @service declare store: StoreService;
  @service declare toast: ToastService;

  @tracked showWebDialog = false;
  @tracked isProcessing = false;
  @tracked isDoneProcessing = false;
  @tracked paid = false;
  @tracked creditCard = this.allPaymentMethods.filter(
    (c: PaymentMethod) => c.isDefault
  )[0];

  actionSheetOptions: ActionSheetButton[] = [
    {
      title: 'Dismiss',
      style: ActionSheetButtonStyle.Cancel,
    },
    {
      title: 'I approve this payment',
    },
  ];

  private async nativeConfirmation(): Promise<void> {
    const invoice = await this.args.model.invoice;
    const total = invoice.formattedTotal;
    const result = await ActionSheet.showActions({
      title: `Amount Due ${total}`,
      message: 'Do you approve this payment?',
      options: this.actionSheetOptions,
    });

    const choice = this.actionSheetOptions[result.index]?.title;
    const confirmed = choice === this.actionSheetOptions[1]?.title;
    if (confirmed) {
      await this.approvePayment();
    }
  }

  private webConfirmation(): void {
    this.toggleWebDialog();
  }

  get allPaymentMethods(): PaymentMethod[] {
    return this.property.user.paymentMethods;
  }

  get property(): any {
    return this.args.model.property;
  }

  @action
  toggleIsProcessing(): void {
    this.isProcessing = !this.isProcessing;
  }

  @action
  async approvePayment(): Promise<void> {
    this.toggleIsProcessing();

    const payment = this.store.createRecord('payment', {
      invoice: this.invoice,
      paymentMethod: this.creditCard,
    });

    try {
      await payment.save(); // this will be long running (probably)
      this.paid = true;
    } catch (e) {
      if (!this.paid) {
        const hasGenericError =
          payment.errors?.content.filter(
            (e: ValidationError) => e.attribute === null
          ).length > 0;
        if (hasGenericError) {
          this.toast.showError(
            'Your payment was unsuccessful. If this happens again, please contact us at hello@houseninja.co.'
          );
        }
        this.toggleIsProcessing();
      }
      captureException(e as Error);
    }
  }

  @action
  toggleWebDialog(): void {
    this.showWebDialog = !this.showWebDialog;
  }

  @action
  async confirm(): Promise<void> {
    if (isNativePlatform()) {
      this.nativeConfirmation();
    } else {
      this.webConfirmation();
    }
  }

  @action
  requestDifferentPayment() {
    this.intercom.showComposer('I would like to update my payment method.');
  }

  @action
  inquireAboutInvoice(): void {
    this.intercom.showComposer(
      `I have a question about the invoice for the ${this.args.model?.description} service request.`
    );
  }

  @action
  selectRoute(): void {
    this.isProcessing = false;
    this.args.model.reload();
    this.router.transitionTo(DashboardRoute.Home);
  }

  get isNativePlatform() {
    return isNativePlatform();
  }

  get invoice(): Invoice | undefined {
    return this.args.model.invoice;
  }

  get formattedTotal(): string | undefined {
    return this.invoice?.formattedTotal;
  }

  // get creditCard() {
  //   return this.store.peekAll('credit-card').firstObject;
  // }
}
