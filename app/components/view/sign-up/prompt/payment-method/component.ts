import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { task, timeout } from 'ember-concurrency';
import { inputValidation } from 'houseninja/utils/components/input-validation';
import { formatCreditCardNumberElement } from 'houseninja/utils/components/formatting';
import { captureException } from 'houseninja/utils/sentry';
import { isPresent } from '@ember/utils';
import { SIGNUP_ROUTE } from 'houseninja/data/enums/routes';
import {
  signupPromoCodeDescription,
  signupPromoCodeAlert,
} from 'houseninja/utils/signup/promo-code-description';
import CurrentService from 'houseninja/services/current';
import RouterService from '@ember/routing/router-service';
import StoreService from 'houseninja/services/store';
import OnboardingService from 'houseninja/services/onboarding';
import PaymentMethod from 'houseninja/models/payment-method';
import PromoCode from 'houseninja/models/promo-code';

const DEBOUNCE_MS = 250;

type Args = {
  paymentMethod?: PaymentMethod;
};

export default class PaymentMethodComponent extends Component<Args> {
  @service declare current: CurrentService;
  @service declare router: RouterService;
  @service declare store: StoreService;
  @service declare onboarding: OnboardingService;

  @tracked isLoading = false;
  @tracked showTermsAndConditions = false;
  @tracked agreedToTermsAndConditions = false;
  @tracked formIsValid = false;
  @tracked shallNotPass = true;
  @tracked promoCode?: string;
  @tracked promoCodeAlert?: string;
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

  constructor(owner: unknown, args: Args) {
    super(owner, args);

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
  goBack(): void {
    this.router.transitionTo(SIGNUP_ROUTE.CONTACT_INFO);
  }

  @action showTermsAndConditionsComponent(isVisible: boolean) {
    this.showTermsAndConditions = isVisible;
  }

  @action
  handleAgreement(agreesToTermsAndConditions: boolean) {
    this.agreedToTermsAndConditions = agreesToTermsAndConditions;
    this.shallNotPass = !(this.formIsValid && this.agreedToTermsAndConditions);
    this.showTermsAndConditionsComponent(false);
  }

  /**
   * This function is called when the user types in the promo code input. It
   * debounces the user input and then checks if the promo code is valid.
   *
   * @param {KeyboardEvent} e - The event when the user types in the promo code input.
   */
  @task({ restartable: true })
  *checkPromoCode(e: KeyboardEvent) {
    this.promoCodeInput = (e.target as HTMLInputElement).value;

    if (this.promoCodeInput.length < 3) {
      return null;
    }
    yield timeout(DEBOUNCE_MS);
    let promoCodes: PromoCode[] = [];
    try {
      promoCodes = yield this.store.query('promo-code', {
        filter: {
          code: this.promoCodeInput,
        },
      });
    } catch (e) {
      captureException(e as Error);
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

  // Validate form fields when user types in them.
  // If the field is the card number field, format it.
  // Otherwise, just store the value as entered.
  // If the user has agreed to terms and conditions, the payment form is valid.
  // If the payment form is valid and the user has agreed to terms and conditions,
  // then the user can submit the payment form.
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

  /**
   * Saves the credit card information and creates a subscription for the user.
   * If there is an existing subscription, it will be updated with the new credit card information.
   * If there is an existing credit card, it will be updated with the new credit card information.
   * @function
   * @private
   * @returns {void}
   */

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

  /**
   * If a subscription already exists, update it with the new plan and promo code.
   * Otherwise, create a new subscription and save it.
   * @return {Subscription}
   */
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
