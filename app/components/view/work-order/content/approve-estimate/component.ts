import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import {
  ActionSheet,
  ActionSheetButtonStyle,
  type ShowActionsResult,
} from '@capacitor/action-sheet';
import { captureException } from 'houseninja/utils/sentry';
import isNativePlatform from 'houseninja/utils/is-native-platform';
import { NATIVE_MOBILE_ROUTE } from 'houseninja/data/enums/routes';

import type Estimate from 'houseninja/models/estimate';
import type WorkOrder from 'houseninja/models/work-order';
import type RouterService from '@ember/routing/router-service';
import type IntercomService from 'houseninja/services/intercom';

interface Args {
  model: WorkOrder;
}

type ActionSheetOptions = Array<{
  title: string;
  style?: ActionSheetButtonStyle;
}>;

export default class WorkOrderApproveEstimateViewContentComponent extends Component<Args> {
  @service declare intercom: IntercomService;
  @service declare router: RouterService;
  @service declare toast: any;

  @tracked showWebDialog = false;
  @tracked showWebDeclineDialog = false;
  @tracked isProcessing = false;
  @tracked isDoneProcessing = false;
  @tracked estimateApproved = false;

  actionSheetOptions: ActionSheetOptions = [
    {
      title: 'Dismiss',
      style: ActionSheetButtonStyle.Cancel,
    },
    {
      title: 'I approve this estimate',
    },
  ];

  private async nativeConfirmation(): Promise<void> {
    const total: string = this.estimate.amount;
    const result: ShowActionsResult = await ActionSheet.showActions({
      title: total
        ? `Do you approve this estimate of ${total}?`
        : `Do you approve this estimate?`,
      message:
        // eslint-disable-next-line max-len
        'I understand that the estimate provided is subject to change and that work will be charged based upon the price of parts plus labor required to complete the project. I agree to cover the cost of any additional work, services or fittings that need to be provided to rectify any event or situation which arises during the course of the work that are unexpected or are beyond the vendor’s control.',
      options: this.actionSheetOptions,
    });

    const choice: string | undefined =
      this.actionSheetOptions[result.index]?.title;
    const confirmed: boolean = choice === this.actionSheetOptions[1]?.title;
    if (confirmed) {
      await this.approveEstimate();
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
  async approveEstimate(): Promise<void> {
    this.toggleIsProcessing();

    this.estimate.approvedAt = new Date();

    try {
      await this.estimate.save();
      this.isDoneProcessing = true;
      this.estimateApproved = true;
    } catch (e: unknown) {
      this.toast.showError(
        'There was an error while approving this estimate. If this happens again, please contact us at hello@houseninja.co.'
      );
      this.estimate.approvedAt = undefined;
      this.toggleIsProcessing();
      captureException(e as Error);
    }
  }

  @action
  toggleWebDialog(): void {
    this.showWebDialog = !this.showWebDialog;
  }

  @action
  toggleDeclineWebDialog(): void {
    this.showWebDeclineDialog = !this.showWebDeclineDialog;
  }

  @action
  async confirm(): Promise<void> {
    if (isNativePlatform()) {
      await this.nativeConfirmation();
    } else {
      this.webConfirmation();
    }
  }

  @action
  async handleDecline(): Promise<void> {
    if (isNativePlatform()) {
      await this.declineNativeConfirmation();
    } else {
      this.toggleDeclineWebDialog();
    }
  }

  @action
  async declineEstimate(): Promise<void> {
    this.toggleIsProcessing();
    this.estimate.declinedAt = new Date();
    try {
      await this.estimate.save();
      this.isDoneProcessing = true;
    } catch (e: unknown) {
      this.toast.showError(
        'There was an error while declining this estimate. If this happens again, please contact us at hello@houseninja.co.'
      );
      captureException(e as Error);
      this.estimate.declinedAt = undefined;
    } finally {
      this.toggleIsProcessing();
    }
  }

  async declineNativeConfirmation() {
    const declineActionSheetOptions: ActionSheetOptions = [
      {
        title: 'Dismiss',
        style: ActionSheetButtonStyle.Cancel,
      },
      {
        title: 'I decline this estimate.',
      },
    ];
    const result: ShowActionsResult = await ActionSheet.showActions({
      title: `Do you decline this estimate?`,
      options: declineActionSheetOptions,
    });

    const choice: string | undefined =
      this.actionSheetOptions[result.index]?.title;
    const confirmed: boolean = choice === this.actionSheetOptions[1]?.title;

    if (confirmed) {
      await this.declineEstimate();
    }
  }

  @action
  async inquireAboutEstimate(): Promise<void> {
    await this.intercom.showComposer(
      `I have a question about the estimate for the ${this.estimate.description} service request.`
    );
  }

  @action
  selectRoute(): void {
    this.isProcessing = false;
    this.args.model.reload();
    this.router.transitionTo(NATIVE_MOBILE_ROUTE.DASHBOARD.HOME);
  }

  get isNativePlatform(): boolean {
    return isNativePlatform();
  }

  get estimate(): Estimate {
    return this.args.model.estimate;
  }

  get formattedTotal(): string | undefined {
    return this.estimate?.get('amount');
  }
}
