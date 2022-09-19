import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { isPresent } from '@ember/utils';
import { tracked } from '@glimmer/tracking';
import { captureException } from 'houseninja/utils/sentry';
import { formatCreditCardNumberElement } from 'houseninja/utils/components/formatting';
import { inputValidation } from 'houseninja/utils/components/input-validation';

export default class WorkOrderApprovePaymentWebDialogViewContentComponent extends Component {
  @service router;
  @service store;
  @service toast;

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

  @action
  downloadFromAppStore() {
    window.open(
      'https://apps.apple.com/us/app/house-ninja/id1603710358',
      '_blank'
    );
  }

  get user() {
    return this.store.peekAll('user').firstObject;
  }
}
