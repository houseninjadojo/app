import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { debug } from '@ember/debug';
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
    cardNumber: this.creditCard.cardNumber,
    cvv: this.creditCard.cvv,
    expMonth: null,
    expYear: null,
    zipcode: null,
    isDefault: false,
  };
  @tracked fields = [
    {
      id: 'cardNumber',
      required: true,
      label: 'Card Number',
      placeholder: '',
      disabled: true,
      value: this.creditCard.obfuscated.lastFour,
    },
    {
      // type: 'number',
      id: 'cvv',
      required: true,
      label: 'Security Code',
      placeholder: '',
      value: this.paymentMethod.cvv || this.creditCard.obfuscated.cvv,
    },
    {
      type: 'number',
      id: 'expMonth',
      required: true,
      label: 'Month',
      placeholder: 'MM',
      value: this.paymentMethod.expMonth || this.creditCard.expMonth,
    },
    {
      type: 'number',
      id: 'expYear',
      required: true,
      label: 'Year',
      placeholder: 'YY',
      value: this.paymentMethod.expYear || this.creditCard.expYear,
    },
    {
      type: 'number',
      id: 'zipcode',
      required: true,
      label: 'Zipcode',
      placeholder: '',
      value: this.paymentMethod.zipcode || this.creditCard.zipcode,
    },
  ];

  @action
  resetForm() {
    // this.fields.forEach((f) => (f.value = this.creditCard[f.id]));
    this.paymentMethod = {
      cardNumber: null,
      cvv: null,
      expMonth: null,
      expYear: null,
      zipcode: null,
      isDefault: false,
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

  get creditCard() {
    return this.model;
  }
}
