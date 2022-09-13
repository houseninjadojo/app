import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { debug } from '@ember/debug';
import { inputValidation } from 'houseninja/utils/components/input-validation';
import { formatCreditCardNumberElement } from 'houseninja/utils/components/formatting';
import Sentry from 'houseninja/utils/sentry';

export default class SettingsPaymentMethodsNewController extends Controller {
  @service router;
  @service view;
  @service store;
  @service current;

  @tracked formIsInvalid = true;
  @tracked paymentMethod = {
    cardNumber: null,
    cvv: null,
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
    },
    {
      type: 'number',
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

  @action
  resetForm() {
    this.fields.forEach((f) => (f.value = null));
    this.paymentMethod = {
      cardNumber: null,
      cvv: null,
      expMonth: null,
      expYear: null,
      zipcode: null,
      isDefault: null,
    };

    this.paymentMethod = { ...this.paymentMethod };
    this.formIsInvalid = true;
  }

  @action
  handleInput(e) {
    if (e.target.id === 'cardNumber') {
      this.paymentMethod[e.target.id] = e.target.value.replace(/\D/g, '');
      formatCreditCardNumberElement(e.target);
      this.fields.filter((f) => f.id === e.target.id)[0].value = e.target.value;
    } else {
      this.paymentMethod[e.target.id] = e.target.value;
      this.fields.filter((f) => f.id === e.target.id)[0].value =
        this.paymentMethod[e.target.id];
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
      return {
        ...f,
      };
    });
    this.formIsInvalid = inputValidation(fields, ['cardIsValid']).isInvalid;
  }
}
