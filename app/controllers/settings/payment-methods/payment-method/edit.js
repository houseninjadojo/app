import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { debug } from '@ember/debug';
import { ActionSheet, ActionSheetButtonStyle } from '@capacitor/action-sheet';
import { inputValidation } from 'houseninja/utils/components/input-validation';
import { formatCreditCardNumber } from 'houseninja/utils/components/formatting';
import Sentry from 'houseninja/utils/sentry';

export default class SettingsPaymentMethodsEditController extends Controller {
  @service router;
  @service view;
  @service store;
  @service current;

  @tracked formIsInvalid = true;

  get fields() {
    return [
      {
        id: 'cardNumber',
        required: true,
        label: 'Card Number',
        placeholder: '',
        disabled: true,
      },
      {
        // type: 'number',
        id: 'cvv',
        required: true,
        label: 'Security Code',
        placeholder: '',
      },
      {
        type: 'number',
        id: 'expMonth',
        required: true,
        label: 'Month',
        placeholder: 'MM',
      },
      {
        type: 'number',
        id: 'expYear',
        required: true,
        label: 'Year',
        placeholder: 'YY',
      },
      {
        type: 'number',
        id: 'zipcode',
        required: true,
        label: 'Zipcode',
        placeholder: '',
      },
    ];
  }

  @action
  handleInput(e) {
    if (e.target.id !== 'cardNumber') {
      this.model.set(e.target.id, e.target.value);
    }

    this.__validateForm();
  }

  @action
  async saveAction() {
    const model = this.store.createRecord('credit-card', {
      ...this.model,
      user: this.current?.user,
    });
    try {
      await model.save();
      this.view.transitionToPreviousRoute();
    } catch (e) {
      debug(e);
      Sentry.captureException(e);
    }
  }

  @action
  handleSetAsDefault() {
    this.model.isDefault = !this.model.isDefault;

    this.__validateForm();
  }

  @action
  async handleRemoveAction() {
    const actionSheetOptions = [
      {
        title: 'Keep this payment method',
        style: ActionSheetButtonStyle.Cancel,
      },
      {
        title: 'Remove this payment method',
        style: ActionSheetButtonStyle.Destructive,
      },
    ];

    const result = await ActionSheet.showActions({
      title: `Are you sure you want to remove this payment method?`,
      options: actionSheetOptions,
    });

    const choice = actionSheetOptions[result.index].title;
    const confirmed = choice === actionSheetOptions[1].title;

    if (confirmed) {
      try {
        await this.model.destroyRecord();
        this.view.transitionToPreviousRoute();
      } catch (e) {
        debug(e);
        Sentry.captureException(e);
      }
    }
  }

  @action
  resetForm() {
    this.formIsInvalid = true;
  }

  __validateForm() {
    const fields = this.fields.map((f) => {
      if (f.id === 'cardNumber') {
        return {
          ...f,
          value: formatCreditCardNumber(this.model.cardNumber),
        };
      } else if (f.id === 'cvv') {
        return {
          ...f,
          value: this.model.cvv,
        };
      } else {
        return {
          ...f,
          value: this.model.get(f.id),
        };
      }
    });

    this.formIsInvalid = inputValidation(fields, ['cardIsValid']).isInvalid;
  }
}
