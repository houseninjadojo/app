import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { isPresent } from '@ember/utils';
import { tracked } from '@glimmer/tracking';
import { formatCreditCardNumberElement } from 'houseninja/utils/components/formatting';
import { inputValidation } from 'houseninja/utils/components/input-validation';

export default class WorkOrderApprovePaymentWebDialogViewContentComponent extends Component {
  @service router;
  @service store;

  @tracked cvc = null;
  @tracked formIsInvalid = true;
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
    try {
      const creditCard = this.store.peekAll('credit-card').firstObject;
      const verification = await this.store.createRecord(
        'resource-verification',
        {
          resourceName: 'credit-card',
          recordId: creditCard?.id,
          attribute: 'cvv',
          // value: this.cvc,
          vgsValue: this.cvc,
        }
      );
      verification.save();
      return true;
    } catch (e) {
      captureException(e);
      return false;
    }
  }

  @action
  validateForm(e) {
    if (e.target.id === 'cardNumber') {
      this.paymentMethod[e.target.id] = e.target.value.replace(/\D/g, '');
      formatCreditCardNumberElement(e.target);
      this.fields.filter((f) => f.id === e.target.id)[0].value = e.target.value;
    } else {
      this.paymentMethod[e.target.id] = e.target.value;
      this.fields.filter((f) => f.id === e.target.id)[0].value =
        this.paymentMethod[e.target.id];
    }

    this.formIsInvalid = inputValidation(this.fields, [
      'cardIsValid',
    ]).isInvalid;
  }

  @action
  async validateCVC() {
    if (this.cvc) {
      const isValid = await this.cvcResourceVerification();
      if (isValid) {
        this.cvcError = [];
        this.args.approvePayment(true);
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
  updatePaymentMethod() {
    const success = true; // update payment method
    if (success) {
      this.args.approvePayment(true);
    } else {
    }
  }

  get paymentInfoIsKnown() {
    return isPresent(this.args.creditCard);
  }

  get creditCard() {
    return this.store.peekAll('credit-card').firstObject;
  }
}
