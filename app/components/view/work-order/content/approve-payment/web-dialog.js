import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { isPresent, isBlank } from '@ember/utils';
import { tracked } from '@glimmer/tracking';
import { captureException } from 'houseninja/utils/sentry';
import { formatCreditCardNumberElement } from 'houseninja/utils/components/formatting';
import { inputValidation } from 'houseninja/utils/components/input-validation';

export default class WorkOrderApprovePaymentWebDialogViewContentComponent extends Component {
  @service router;
  @service store;
  @service toast;

  @tracked cvc = null;
  @tracked cvcError = [];
  @tracked paymentMethodFormIsInvalid = true;
  @tracked paymentMethod = {
    cardNumber: null,
    cvv: null,
    expMonth: null,
    expYear: null,
    zipcode: null,
  };
  @tracked errors = {
    cardNumber: [],
    cvv: [],
    expMonth: [],
    expYear: [],
    zipcode: [],
  };

  paymentInfoIsKnown = isPresent(this.args.creditCard);
  fields = [
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

  async _cvcResourceVerification() {
    let verification;

    try {
      const creditCard = this.store.peekAll('credit-card').firstObject;
      verification = await this.store.createRecord('resource-verification', {
        resourceName: 'credit-card',
        recordId: creditCard?.id,
        attribute: 'cvv',
        // value: this.cvc,
        vgsValue: this.cvc,
      });
      verification.save();
      return true;
    } catch (e) {
      captureException(e);

      const hasGenericError =
        verification.errors?.messages.filter((e) => e.attribute === null)
          .length > 0;

      if (hasGenericError) {
        this.toast.showError(
          'There was an issue while verifying your payment method. If this happens again, please contact us at hello@houseninja.co.'
        );
      }

      return false;
    }
  }

  @action
  validatePaymentMethodForm(e) {
    if (e.target.id === 'cardNumber') {
      this.paymentMethod[e.target.id] = e.target.value.replace(/\D/g, '');
      formatCreditCardNumberElement(e.target);
      this.fields.filter((f) => f.id === e.target.id)[0].value = e.target.value;
    } else {
      this.paymentMethod[e.target.id] = e.target.value;
      this.fields.filter((f) => f.id === e.target.id)[0].value =
        this.paymentMethod[e.target.id];
    }

    this.paymentMethodFormIsInvalid = inputValidation(this.fields, [
      'cardIsValid',
    ]).isInvalid;
  }

  @action
  validateCVCInput(e) {
    this.cvc = e.target.value;
    this.paymentMethodFormIsInvalid = isBlank(this.cvc);
  }

  @action
  async validateCVC() {
    if (this.cvc) {
      const isValid = await this._cvcResourceVerification();

      if (isValid) {
        this.cvcError = [];
        this.args.approvePayment();
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
  async updatePaymentMethod() {
    let paymentMethod;
    try {
      paymentMethod = this.store.createRecord('credit-card', {
        ...this.paymentMethod,
        user: this.user,
      });
      await paymentMethod.save();
      this.args.approvePayment();
    } catch (e) {
      if (isPresent(paymentMethod)) {
        this.errors = paymentMethod.errors;

        const hasGenericError =
          this.errors?.messages.filter((e) => e.attribute === null).length > 0;

        if (hasGenericError) {
          this.toast.showError(
            'There was an issue while verifying your payment method. If this happens again, please contact us at hello@houseninja.co.'
          );
        }
      }

      captureException(e);
    }
  }

  get creditCard() {
    return this.store.peekAll('credit-card').firstObject;
  }

  get user() {
    return this.store.peekAll('user').firstObject;
  }
}
