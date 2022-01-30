import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { debug } from '@ember/debug';
import * as Sentry from '@sentry/ember';

export default class PaymentMethodComponent extends Component {
  @service current;
  @service router;
  @service store;

  @tracked agreesToTermsAndConditions;
  @tracked promoCode;
  @tracked paymentMethod = {
    cvv: null,
    expMonth: null,
    expYear: null,
    number: null,
    zipcode: null,
  };

  fields = [
    {
      id: 'card-number',
      required: true,
      label: 'Card Number',
      placeholder: '',
      value: 'number',
    },
    {
      type: 'number',
      id: 'cvc',
      required: true,
      label: 'CVC',
      placeholder: '',
      value: 'cvv',
    },
    {
      type: 'number',
      id: 'card-month',
      required: true,
      label: 'Month',
      placeholder: 'MM',
      value: 'expMonth',
    },
    {
      type: 'number',
      id: 'card-year',
      required: true,
      label: 'Year',
      placeholder: 'YYYY',
      value: 'expYear',
    },
    {
      type: 'number',
      id: 'card-zipcode',
      required: true,
      label: 'Zipcode',
      placeholder: '',
      value: 'zipcode',
    },
  ];

  @action
  async savePaymentMethod() {
    const user = this.current.user;
    let paymentMethod = this.store.createRecord('credit-card', {
      ...this.paymentMethod,
      user,
    });
    try {
      await paymentMethod.save();
      this.router.transitionTo('signup.set-password');
    } catch (e) {
      debug(e);
      Sentry.captureException(e);
    }
  }

  @action
  goBack() {
    this.router.transitionTo('signup.contact-info');
  }
}
