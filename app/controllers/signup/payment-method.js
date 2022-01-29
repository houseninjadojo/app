import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
import breadcrumbs from 'houseninja/utils/signup/breadcrumbs';
import * as Sentry from '@sentry/ember';

export default class SignupPaymentMethodController extends Controller {
  breadcrumbs = breadcrumbs.signUp;

  @service current;
  @service store;

  @tracked number;
  @tracked cvv;
  @tracked expMonth;
  @tracked expYear;
  @tracked zipcode;

  paymentFields = [
    {
      id: 'card-number',
      required: true,
      label: 'Card Number',
      placeholder: '',
      value: this.number,
    },
    {
      type: 'number',
      id: 'cvc',
      required: true,
      label: 'CVC',
      placeholder: '',
      value: this.cvv,
    },
    {
      type: 'number',
      id: 'card-month',
      required: true,
      label: 'Month',
      placeholder: 'MM',
      value: this.expMonth,
    },
    {
      type: 'number',
      id: 'card-year',
      required: true,
      label: 'Year',
      placeholder: 'YYYY',
      value: this.expYear,
    },
    {
      type: 'number',
      id: 'card-zipcode',
      required: true,
      label: 'Zipcode',
      placeholder: '',
      value: this.zipcode,
    },
  ];

  @action
  async savePaymentMethod() {
    const user = this.current.user;
    let paymentMethod = this.store.createRecord('credit-card', {
      cvv: this.cvv,
      expMonth: this.expMonth,
      expYear: this.expYear,
      number: this.number,
      zipcode: this.zipcode,
      user,
    });
    try {
      await paymentMethod.save();
      this.router.transitionTo('signup.set-password');
    } catch (e) {
      Sentry.captureException(e);
    }
  }

  @action
  goBack() {
    this.router.transitionTo('signup.contact-info');
  }
}
