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
import { findAll } from 'ember-data-resources';
import IntercomService from 'houseninja/services/intercom';
import RouterService from '@ember/routing/router-service';
import StoreService from 'houseninja/services/store';
import ToastService from 'houseninja/services/toast';
import WorkOrder from 'houseninja/models/work-order';
import { ValidationError } from '@ember-data/adapter/error';
import Invoice from 'houseninja/models/invoice';
import MetricsService from 'houseninja/services/metrics';
import SessionService from 'houseninja/services/session';
import CreditCard from 'houseninja/models/credit-card';
import ArrayProxy from '@ember/array/proxy';

type Args = {
  model: WorkOrder;
};

export default class WorkOrderApprovePaymentViewContentComponent extends Component<Args> {
  @service declare intercom: IntercomService;
  @service declare router: RouterService;
  @service declare metrics: MetricsService;
  @service declare session: SessionService;
  @service declare store: StoreService;
  @service declare toast: ToastService;

  @tracked showWebDialog = false;
  @tracked isProcessing = false;
  @tracked isDoneProcessing = false;
  @tracked paid = false;
  @tracked paymentFailed = false;

  creditCards = findAll(this, 'credit-card');

  constructor(owner: unknown, args: Args) {
    super(owner, args);
    this.sendMetrics('session');
  }

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

  @action
  toggleIsProcessing(): void {
    this.isProcessing = !this.isProcessing;
  }

  @action
  async approvePayment(): Promise<void> {
    this.toggleIsProcessing();

    const payment = this.store.createRecord('payment', {
      invoice: this.invoice,
    });

    try {
      await payment.save(); // this will be long running (probably)
      this.paid = true;
      this.sendMetrics('success');
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
      this.sendMetrics('error', 'payment');
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
  requestDifferentPayment(): void {
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
    if (!this.isNativePlatform) {
      this.session.invalidate();
    }
    this.router.transitionTo(DashboardRoute.Home);
  }

  get isNativePlatform(): boolean {
    return isNativePlatform();
  }

  get invoice(): Invoice | undefined {
    return this.args.model.invoice;
  }

  get formattedTotal(): string | undefined {
    return this.invoice?.formattedTotal;
  }

  get creditCard(): CreditCard {
    const cards = this.creditCards.records as ArrayProxy<CreditCard>;
    return cards?.firstObject as CreditCard;
  }

  sendMetrics(event: string, step?: string): void {
    if (!this.isNativePlatform) {
      this.metrics.trackEvent({
        event: `external.payment-approval.${event}`,
        properties: { step },
      });
    }
  }
}
