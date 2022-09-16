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
  @tracked paymentMethod = {
    cardNumber: this.model.cardNumber,
    cvv: this.model.cvv,
    expMonth: this.model.expMonth,
    expYear: this.model.expYear,
    zipcode: this.model.zipcode,
    isDefault: this.model.isDefault,
  };
  @tracked fields = [
    {
      id: 'cardNumber',
      required: true,
      label: 'Card Number',
      placeholder: '',
      disabled: true,
      value: this.model.obfuscated.lastFour,
    },
    {
      // type: 'number',
      id: 'cvv',
      required: true,
      label: 'Security Code',
      placeholder: '',
      value: this.paymentMethod.cvv || this.model.obfuscated.cvv,
    },
    {
      type: 'number',
      id: 'expMonth',
      required: true,
      label: 'Month',
      placeholder: 'MM',
      value: this.paymentMethod.expMonth || this.model.expMonth,
    },
    {
      type: 'number',
      id: 'expYear',
      required: true,
      label: 'Year',
      placeholder: 'YY',
      value: this.paymentMethod.expYear || this.model.expYear,
    },
    {
      type: 'number',
      id: 'zipcode',
      required: true,
      label: 'Zipcode',
      placeholder: '',
      value: this.paymentMethod.zipcode || this.model.zipcode,
    },
  ];

  @action
  resetForm() {
    this.fields.forEach((f) => {
      if (f.id === 'cardNumber') {
        f.value = this.model.obfuscated.lastFour;
      } else if (f.id === 'cvv') {
        f.value = this.model.obfuscated.cvv;
      } else {
        f.value = this.model[f.id];
      }
    });
    this.paymentMethod = {
      cardNumber: this.model.cardNumber,
      cvv: this.model.cvv,
      expMonth: this.model.expMonth,
      expYear: this.model.expYear,
      zipcode: this.model.zipcode,
      isDefault: this.model.isDefault,
    };

    this.fields = [...this.fields];
    this.paymentMethod = { ...this.paymentMethod };
    this.formIsInvalid = true;
  }

  @action
  handleInput(e) {
    if (e.target.id !== 'cardNumber') {
      this.paymentMethod[e.target.id] = e.target.value;
      this.fields.filter((f) => f.id === e.target.id)[0].value =
        this.paymentMethod[e.target.id];
      this.fields = [...this.fields];
      this.paymentMethod = { ...this.paymentMethod };
    }

    this.__validateForm();
  }

  @action
  async saveAction() {
    const model = this.store.createRecord('credit-card', {
      ...this.paymentMethod,
      user: this.current?.user,
    });
    try {
      await model.save();
      await this.resetForm();
      this.view.transitionToPreviousRoute();
    } catch (e) {
      debug(e);
      Sentry.captureException(e);
    }
  }

  @action
  handleSetAsDefault() {
    this.paymentMethod.isDefault = !this.paymentMethod.isDefault;
    this.paymentMethod = { ...this.paymentMethod };

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
        await this.resetForm();
        this.view.transitionToPreviousRoute();
      } catch (e) {
        debug(e);
        Sentry.captureException(e);
      }
    }
  }

  __validateForm() {
    const fields = this.fields.map((f) => {
      if (f.id === 'cardNumber') {
        return {
          ...f,
          value: formatCreditCardNumber(this.paymentMethod.cardNumber),
        };
      } else if (f.id === 'cvv') {
        return {
          ...f,
          value: this.paymentMethod.cvv,
        };
      } else {
        return {
          ...f,
          value: this.paymentMethod[f.id],
        };
      }
    });

    console.log('fields', fields);

    this.formIsInvalid = inputValidation(fields, ['cardIsValid']).isInvalid;
  }
}
