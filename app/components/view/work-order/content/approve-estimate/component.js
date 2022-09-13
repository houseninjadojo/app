import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { ActionSheet, ActionSheetButtonStyle } from '@capacitor/action-sheet';
import { captureException } from 'houseninja/utils/sentry';
import isNativePlatform from 'houseninja/utils/is-native-platform';
import { NATIVE_MOBILE_ROUTE } from 'houseninja/data/enums/routes';

export default class WorkOrderApproveEstimateViewContentComponent extends Component {
  @service intercom;
  @service router;
  @service store;

  @tracked showWebDialog = false;
  @tracked isProcessing = false;
  @tracked isDoneProcessing = false;
  @tracked estimateApproved = false;

  actionSheetOptions = [
    {
      title: 'Dismiss',
      style: ActionSheetButtonStyle.Cancel,
    },
    {
      title: 'I approve this estimate',
    },
  ];

  async _nativeConfirmation() {
    const total = this.args.model.get('estimate.amount');
    const result = await ActionSheet.showActions({
      title: total
        ? `Do you approve this estimate of ${total}?`
        : `Do you approve this estimate?`,
      message:
        'I understand that the estimate provided is subject to change and that work will be charged based upon the price of parts plus labor required to complete the project. I agree to cover the cost of any additional work, services or fittings that need to be provided to rectify any event or situation which arises during the course of the work that are unexpected or are beyond the vendor’s control.',
      options: this.actionSheetOptions,
    });

    const choice = this.actionSheetOptions[result.index].title;
    const confirmed = choice === this.actionSheetOptions[1].title;
    if (confirmed) {
      await this.approveEstimate();
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
  async approveEstimate() {
    this.toggleIsProcessing();

    this.estimate.approvedAt = new Date();

    try {
      this.estimate.save();
      setTimeout(() => {
        this.estimateApproved = true;
      }, 1000);
    } catch (e) {
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
  inquireAboutEstimate() {
    this.intercom.showComposer(
      `I have a question about the estimate for the ${this.args.model?.description} service request.`
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

  get estimate() {
    return this.args.model.estimate;
  }

  get formattedTotal() {
    return this.estimate?.formattedTotal;
  }
}
