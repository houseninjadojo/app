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

import type { AsyncBelongsTo } from '@ember-data/model';

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

  @tracked showWebDialog = false;
  @tracked isProcessing = false;
  @tracked isDoneProcessing = false;

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
    const estimate = await this.args.model.estimate;
    const total: string = estimate.amount;
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

    const estimate = await this.args.model.estimate;
    estimate.approvedAt = new Date();

    try {
      estimate.save();
    } catch (e: unknown) {
      estimate.approvedAt = undefined;
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
  async decline(): Promise<void> {
    console.log('Customer declined estimate');
  }

  @action
  async inquireAboutEstimate(): Promise<void> {
    const estimate = await this.args.model;
    await this.intercom.showComposer(
      `I have a question about the estimate for the ${estimate.description} service request.`
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

  get estimate(): AsyncBelongsTo<Estimate> {
    return this.args.model.estimate;
  }

  get formattedTotal(): string | undefined {
    return this.args.model.estimate?.get('amount');
  }

  get estimateApproved(): boolean {
    return this.args.model.estimate?.get('isApproved') === true;
  }
}
