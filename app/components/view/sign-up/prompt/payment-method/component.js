import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { debug } from '@ember/debug';
import { task, timeout } from 'ember-concurrency';
import { inputValidation } from 'houseninja/utils/components/input-validation';
import {
  formatCreditCardNumberElement,
  formatCreditCardNumber,
} from 'houseninja/utils/components/formatting';
import Sentry from 'houseninja/utils/sentry';
import { isPresent } from '@ember/utils';

const DEBOUNCE_MS = 250;

export default class PaymentMethodComponent extends Component {
  @service current;
  @service router;
  @service store;

  @tracked showTermsAndConditions = false;
  @tracked agreedToTermsAndConditions = false;
  @tracked formIsValid = false;
  @tracked shallNotPass = true;
  @tracked promoCode;
  @tracked promoCodeAlert;
  @tracked promoCodeDescription = '';
  @tracked promoCodeInput = '';
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

  constructor() {
    super(...arguments);

    if (isPresent(this.args.paymentMethod)) {
      this.paymentMethod = this.args.paymentMethod.getProperties(
        'cardNumber',
        'cvv',
        'expMonth',
        'expYear',
        'zipcode'
      );
      this.formIsValid = true;
    }
  }

  @action
  goBack() {
    this.router.transitionTo('signup.plan-selection');
  }

  @action showTermsAndConditionsComponent(isVisible) {
    this.showTermsAndConditions = isVisible;
  }

  @action
  handleAgreement(agreesToTermsAndConditions) {
    this.agreedToTermsAndConditions = agreesToTermsAndConditions;
    this.shallNotPass = !(this.formIsValid && this.agreedToTermsAndConditions);
    this.showTermsAndConditionsComponent(false);
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

    this.formIsValid = !inputValidation(this.fields, ['cardIsValid']).isInvalid;
    this.shallNotPass = !(this.formIsValid && this.agreedToTermsAndConditions);
  }

  @action
  async savePaymentMethod() {
    const user = this.store.peekAll('user').get('firstObject');
    const subscription = this.store.peekAll('subscription').get('firstObject');

    this.paymentMethod.cardNumber = formatCreditCardNumber(
      this.paymentMethod.cardNumber
    );

    let paymentMethod;
    try {
      subscription.user = user;
      subscription.promoCode = this.promoCode;

      if (isPresent(this.args.paymentMethod)) {
        paymentMethod = this.args.paymentMethod;
        paymentMethod.setProperties({
          ...this.paymentMethod,
          subscription,
          user,
        });
      } else {
        paymentMethod = this.store.createRecord('credit-card', {
          ...this.paymentMethod,
          subscription,
          user,
        });
      }

      await paymentMethod.save();
      await subscription.save();

      this.router.transitionTo('signup.welcome');
    } catch (e) {
      if (isPresent(paymentMethod)) {
        this.errors = paymentMethod.errors;
      }
      debug(e);
      Sentry.captureException(e);
    }
  }
}
