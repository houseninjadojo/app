import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { ActionSheet, ActionSheetButtonStyle } from '@capacitor/action-sheet';
import Sentry from 'houseninja/utils/sentry';
import { workOrderStatus } from 'houseninja/data/work-order-status';
import isNativePlatform from 'houseninja/utils/is-native-platform';
import { NATIVE_MOBILE_ROUTE } from 'houseninja/data/enums/routes';

export default class WorkOrderApprovePaymentViewContentComponent extends Component {
  @service router;

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

  async _nativeConfirmation() {
    const result = await ActionSheet.showActions({
      title: 'Amount Due $999',
      message: 'Do you approve this payment?',
      options: this.actionSheetOptions,
    });

    const choice = this.actionSheetOptions[result.index].title;
    const confirmed = choice === this.actionSheetOptions[1].title;
    if (confirmed) {
      this._handlePaymentApproval();
    }
  }

  _webConfirmation() {
    this.toggleModal();
  }

  async _handlePaymentApproval(isWeb = false) {
    this.isProcessing = true;
    try {
      const success = Math.random() < 1;

      setTimeout(() => {
        if (success) {
          this.isDoneProcessing = true;

          setTimeout(() => {
            this.paid = success;
            isWeb && this.toggleModal();
          }, 2250);
        } else {
          this.isProcessing = false;
          this.updateWorkOrderStatus(false);
        }
      }, 2500);
    } catch (e) {
      Sentry.captureException(e);

      setTimeout(() => {
        this.isProcessing = false;
        this.updateWorkOrderStatus(false);
      }, 3000);
    }
  }

  @action
  toggleModal() {
    this.showWebDialog = !this.showWebDialog;
  }

  @action
  async validateCVC() {
    if (this.cvc) {
      const that = this;
      let isValid = await new Promise(function (resolve) {
        setTimeout(() => resolve(that.cvc === '123'), 1000);
      });
      if (isValid) {
        this.cvcError = [];
        this._handlePaymentApproval(true);
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
    setTimeout(() => {
      this.router.transitionTo(NATIVE_MOBILE_ROUTE.DASHBOARD.HOME);
    }, 500);
  }

  @action
  closeWindow() {
    window.close();
  }
}
