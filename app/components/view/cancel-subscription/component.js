import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { ActionSheet, ActionSheetButtonStyle } from '@capacitor/action-sheet';

import { captureException } from 'houseninja/utils/sentry';
import isNativePlatform from 'houseninja/utils/is-native-platform';
import { NATIVE_MOBILE_ROUTE } from 'houseninja/data/enums/routes';

export default class CancelSubscriptionViewComponent extends Component {
  @service analytics;
  @service router;
  @service store;
  @service view;

  @tracked isProcessing = false;
  @tracked hasProcessed = false;

  _getActionSheetOptions(deleteUserData = false) {
    return [
      {
        title: 'No, I changed my mind approve this payment',
        style: ActionSheetButtonStyle.Cancel,
      },
      {
        title: deleteUserData
          ? 'Yes, cancel my subscription and delete my data'
          : 'Yes, cancel my subscription',
        style: ActionSheetButtonStyle.Destructive,
      },
    ];
  }

  async _cancelSubscription(deleteUserData = false) {
    this.isProcessing = true;
    try {
      if (this.args.model.subscription) {
        const { subscription } = this.args.model;
        await subscription.deleteRecord();
        await subscription.save();

        if (deleteUserData && this.args.model.user) {
          const { user } = this.args.model;
          await user.deleteRecord();
          await user.save();
        }
        this.hasProcessed = true;
      }
    } catch (e) {
      captureException(e);
    } finally {
      if (this.hasProcessed) {
        new Promise((resolve) => {
          setTimeout(() => {
            this.isProcessing = false;
            resolve();
          }, 2000);
        }).then(() => {
          this.router.transitionTo(
            NATIVE_MOBILE_ROUTE.CANCEL_SUBSCRIPTION.CONFIRMATION
          );
        });
      } else {
        this.isProcessing = false;
      }
    }
  }

  async _nativeConfirmation(deleteUserData = false) {
    const result = await ActionSheet.showActions({
      title: 'Are you sure you would like to cancel your subscription?',
      // message: 'Are you sure you would like to cancel your subscription?',
      options: this._getActionSheetOptions(deleteUserData),
    });

    const choice = this._getActionSheetOptions()[result.index].title;
    const confirmed = choice === this._getActionSheetOptions()[1].title;

    if (confirmed) {
      confirmed && this._cancelSubscription(deleteUserData);
    }
  }

  @action
  async handleCancel(deleteUserData = false) {
    if (isNativePlatform()) {
      this._nativeConfirmation(deleteUserData);
    }
  }
}
