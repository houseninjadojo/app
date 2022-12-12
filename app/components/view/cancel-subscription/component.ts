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
import { SubscriptionRoute } from 'houseninja/data/enums/routes';
import { runTask } from 'ember-lifeline';

import ViewService from 'houseninja/services/view';
import StoreService from 'houseninja/services/store';
import RouterService from '@ember/routing/router-service';
import MetricsService from 'houseninja/services/metrics';
import Subscription from 'houseninja/models/subscription';
import User from 'houseninja/models/user';

type Args = {
  model: {
    subscription: Subscription;
    user?: User;
  };
};

export default class CancelSubscriptionViewComponent extends Component<Args> {
  @service declare metrics: MetricsService;
  @service declare router: RouterService;
  @service declare store: StoreService;
  @service declare view: ViewService;

  @tracked isProcessing = false;
  @tracked hasProcessed = false;

  #getActionSheetOptions(deleteUserData = false): ActionSheetButton[] {
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

  async #cancelSubscription(deleteUserData = false): Promise<void> {
    this.isProcessing = true;
    try {
      if (this.args.model.subscription) {
        this.metrics.trackEvent({
          event: 'subscription.canceled',
          properties: {
            usr: {
              id: this.args.model.user?.id,
              email: this.args.model.user?.email,
            },
            subscription: {
              id: this.args.model.subscription.id,
            },
          },
        });
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
      captureException(e as Error);
    } finally {
      if (this.hasProcessed) {
        runTask(
          this,
          () => {
            this.isProcessing = false;
          },
          2000
        );
        this.router.transitionTo(SubscriptionRoute.CancelConfirmation);
      } else {
        this.isProcessing = false;
      }
    }
  }

  async #nativeConfirmation(deleteUserData = false): Promise<void> {
    const result = await ActionSheet.showActions({
      title: 'Are you sure you would like to cancel your subscription?',
      // message: 'Are you sure you would like to cancel your subscription?',
      options: this.#getActionSheetOptions(deleteUserData),
    });

    const choice = this.#getActionSheetOptions()[result.index]?.title;
    const confirmed = choice === this.#getActionSheetOptions()[1]?.title;

    if (confirmed) {
      confirmed && this.#cancelSubscription(deleteUserData);
    }
  }

  @action
  async handleCancel(deleteUserData = false): Promise<void> {
    if (isNativePlatform()) {
      await this.#nativeConfirmation(deleteUserData);
    }
  }
}
