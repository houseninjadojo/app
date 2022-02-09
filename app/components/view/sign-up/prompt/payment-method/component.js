import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { debug } from '@ember/debug';
import { task, timeout } from 'ember-concurrency';
import * as Sentry from '@sentry/ember';

const DEBOUNCE_MS = 250;

export default class PaymentMethodComponent extends Component {
  @service current;
  @service router;
  @service store;

  @tracked agreesToTermsAndConditions;
  @tracked promoCode;
  @tracked promoCodeAlert;
  @tracked promoCodeDescription = '';
  @tracked promoCodeInput = '';
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
      value: 'cardNumber',
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
    const user = this.store.peekAll('user').get('firstObject');
    const subscription = this.store.peekAll('subscription').get('firstObject');
    const paymentMethod = this.store.createRecord('credit-card', {
      ...this.paymentMethod,
      user,
    });
    try {
      await paymentMethod.save();

      subscription.user = user;
      subscription.paymentMethod = paymentMethod;
      subscription.promoCode = this.promoCode;

      await subscription.save();

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

  @task({ restartable: true })
  *checkPromoCode() {
    if (this.promoCodeInput.length < 3) {
      return null;
    }
    yield timeout(DEBOUNCE_MS);
    let promoCodes = [];
    try {
      promoCodes = yield this.store.query('promo-code', {
        filter: {
          code: this.promoCodeInput,
        },
      });
    } catch (e) {
      Sentry.captureException(e);
    } finally {
      if (promoCodes.length > 0) {
        this.promoCode = promoCodes.get('firstObject');
        this.promoCodeAlert = null;
        this.promoCodeDescription = `Promo code '${this.promoCode.code}' applied.`;
      } else {
        this.promoCodeAlert = {
          title: `Promo Code '${this.promoCodeInput}' is not valid`,
          detail: `Please try again with a different code.`,
        };
        this.promoCodeDescription = '';
      }
    }
  }
}
