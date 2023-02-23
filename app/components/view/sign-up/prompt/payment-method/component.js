import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { task, timeout } from 'ember-concurrency';
import { inputValidation } from 'houseninja/utils/components/input-validation';
import { formatCreditCardNumberElement, formatExpMonth } from 'houseninja/utils/components/formatting';
import { captureException } from 'houseninja/utils/sentry';
import { isPresent } from '@ember/utils';
import { SIGNUP_ROUTE } from 'houseninja/data/enums/routes';
import {
  signupPromoCodeDescription,
  signupPromoCodeAlert,
} from 'houseninja/utils/signup/promo-code-description';

const DEBOUNCE_MS = 250;

export default class PaymentMethodComponent extends Component {
  @service current;
  @service router;
  @service store;
  @service onboarding;

  @tracked isLoading = false;
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
    this.router.transitionTo(SIGNUP_ROUTE.CONTACT_INFO);
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
  *checkPromoCode(e) {
    this.promoCodeInput = e.target.value;

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
      captureException(e);
    } finally {
      this.promoCode =
        promoCodes.length > 0 ? promoCodes.get('firstObject') : null;
      this.promoCodeAlert = signupPromoCodeAlert(
        this.promoCodeInput,
        this.promoCode
      );
      this.promoCodeDescription = signupPromoCodeDescription(this.promoCode);
    }
  }

  @action
  validateForm(e) {
    if (e.target.id === 'expMonth') {
      this.paymentMethod[e.target.id] = e.target.value.replace(/\D/g, '');
      formatExpMonth(e.target);
      this.fields.filter((f) => f.id === e.target.id)[0].value = e.target.value;
    } else if (e.target.id === 'cardNumber') {
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
    this.isLoading = true;
    const user = await this.onboarding.fetchLocalModel('user');
    const subscription = await this.findOrCreateSubscription();

    let paymentMethod;
    try {
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

      this.router.transitionTo(SIGNUP_ROUTE.WELCOME);
    } catch (e) {
      if (isPresent(paymentMethod)) {
        this.errors = paymentMethod.errors;
      }
      captureException(e);
    } finally {
      this.isLoading = false;
    }
  }

  async findOrCreateSubscription() {
    const user = await this.onboarding.fetchLocalModel('user');
    const subscriptionPlan = await this.onboarding.fetchLocalModel(
      'subscription-plan'
    );
    const promoCode = this.promoCode;
    let subscription = await this.onboarding.fetchLocalModel('subscription');
    if (isPresent(subscription)) {
      subscription.setProperties({
        promoCode,
        subscriptionPlan,
        user,
      });
    } else {
      subscription = this.store.createRecord('subscription', {
        promoCode,
        subscriptionPlan,
        user,
      });
    }
    return subscription;
  }
}
