import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { task, timeout } from 'ember-concurrency';
import { inputValidation } from 'houseninja/utils/components/input-validation';
import {
  formatCreditCardNumberElement,
  formatCvv,
  formatExpMonth,
  formatExpYear,
} from 'houseninja/utils/components/formatting';
import { captureException } from 'houseninja/utils/sentry';
import { isPresent } from '@ember/utils';
import { SIGNUP_ROUTE } from 'houseninja/data/enums/routes';
import {
  signupPromoCodeDescription,
  signupPromoCodeAlert,
} from 'houseninja/utils/signup/promo-code-description';
import RouterService from '@ember/routing/router-service';
import CurrentService from 'houseninja/services/current';
import StoreService from 'houseninja/services/store';
import OnboardingService from 'houseninja/services/onboarding';
import type PromoCode from 'houseninja/models/promo-code';
import type CreditCard from 'houseninja/models/credit-card';
import type Subscription from 'houseninja/models/subscription';
import type { Field } from 'houseninja/app/components';

const DEBOUNCE_MS = 250;

interface PromoCodeAlert {
  title: string;
  detail: string;
}

type Args = {
  creditCard: CreditCard;
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
  @tracked promoCode?: PromoCode;
  @tracked promoCodeAlert?: PromoCodeAlert;
  @tracked promoCodeDescription = '';
  @tracked promoCodeInput = '';

  fields: Field[] = [
    {
      id: 'cardNumber',
      required: true,
      label: 'Card Number',
      inputmode: 'numeric',
      placeholder: '',
    },
    {
      id: 'cvv',
      required: true,
      label: 'Security Code',
      inputmode: 'numeric',
      placeholder: '',
    },
    {
      id: 'expMonth',
      required: true,
      label: 'Month',
      inputmode: 'numeric',
      placeholder: 'MM',
    },
    {
      id: 'expYear',
      required: true,
      label: 'Year',
      inputmode: 'numeric',
      placeholder: 'YY',
    },
    {
      type: 'number',
      id: 'zipcode',
      required: true,
      label: 'Zipcode',
      inputmode: 'numeric',
      placeholder: '',
    },
  ];

  constructor(owner: unknown, args: Args) {
    super(owner, args);

    if (!this.args.creditCard.isNew) {
      this.formIsValid = true;
    }
  }

  @action
  goBack() {
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

  @task({ restartable: true })
  *checkPromoCode(e: Event) {
    const target = <HTMLInputElement>e.target;
    this.promoCodeInput = target.value;

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
    } catch (e: any) {
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
  validateForm(e: Event) {
    const target = <HTMLInputElement>e.target;
    if (target.id === 'expMonth') {
      this.args.creditCard.set('expMonth', formatExpMonth(target));
      const field = this.fields.find((f) => f.id === 'expMonth');
      if (field) {
        field.value = this.args.creditCard.get('expMonth');
      }
    } else if (target.id === 'cardNumber') {
      this.args.creditCard.set(
        'cardNumber',
        formatCreditCardNumberElement(target)
      );
      const field = this.fields.find((f) => f.id === 'cardNumber');
      if (field) {
        field.value = this.args.creditCard.get('cardNumber');
      }
    } else if (target.id === 'expYear') {
      this.args.creditCard.set('expYear', formatExpYear(target));
      const field = this.fields.find((f) => f.id === 'expYear');
      if (field) {
        field.value = this.args.creditCard.get('expYear');
      }
    } else if (target.id === 'zipcode') {
      this.args.creditCard.set('zipcode', target.value);
      const field = this.fields.find((f) => f.id === 'zipcode');
      if (field) {
        field.value = this.args.creditCard.get('zipcode');
      }
    } else if (target.id === 'cvv') {
      this.args.creditCard.set('cvv', formatCvv(target));
      const field = this.fields.find((f) => f.id === 'cvv');
      if (field) {
        field.value = this.args.creditCard.get('cvv');
      }
    }

    const validationObject = inputValidation(this.fields, ['cardIsValid']);
    this.formIsValid = !validationObject.isInvalid;
    this.shallNotPass = !(this.formIsValid && this.agreedToTermsAndConditions);
  }

  @action
  async savePaymentMethod() {
    this.isLoading = true;
    const user = await this.onboarding.fetchLocalModel('user');
    const subscription = await this.findOrCreateSubscription();

    try {
      this.args.creditCard.set('subscription', subscription);
      this.args.creditCard.set('user', user);

      await this.args.creditCard.save();
      await subscription.save();

      this.router.transitionTo(SIGNUP_ROUTE.WELCOME);
    } catch (e: any) {
      captureException(e);
    } finally {
      this.isLoading = false;
    }
  }

  async findOrCreateSubscription(): Promise<Subscription> {
    const user = await this.onboarding.fetchLocalModel('user');
    const subscriptionPlan = await this.onboarding.fetchLocalModel(
      'subscription-plan'
    );
    const promoCode = this.promoCode;
    let subscription = (await this.onboarding.fetchLocalModel(
      'subscription'
    )) as Subscription;
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
