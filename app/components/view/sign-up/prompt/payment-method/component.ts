import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { task, timeout } from 'ember-concurrency';
import { inputValidation } from 'houseninja/utils/components/input-validation';
import {
  formatCreditCardNumberElement,
  formatExpMonth,
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

  // @tracked errors = {
  //   cardNumber: [],
  //   cvv: [],
  //   expMonth: [],
  //   expYear: [],
  //   zipcode: [],
  // };

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

    if (isPresent(this.args.creditCard)) {
      // this.paymentMethod =
      // this.paymentMethod.cardNumber = this.args.paymentMethod.get('cardNumber');
      // this.paymentMethod.cvv = this.args.paymentMethod.get('cvv');
      // this.paymentMethod.expMonth = this.args.paymentMethod.get('expMonth');
      // this.paymentMethod.expYear = this.args.paymentMethod.get('expYear');
      // this.paymentMethod.zipcode = this.args.paymentMethod.get('zipcode');
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
  handleAgreement(agreesToTermsAndConditions: any) {
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
      //this.paymentMethod[e.target.id] = e.target.value.replace(/\D/g, '');
      formatExpMonth(target);
      //this.fields.filter((f) => f.id === e.target.id)[0].value = e.target.value;
      this.args.creditCard.set('expMonth', formatExpMonth(target));
    } else if (target.id === 'cardNumber') {
      //this.paymentMethod[e.target.id] = e.target.value.replace(/\D/g, '');
      this.args.creditCard.set(
        'cardNumber',
        formatCreditCardNumberElement(target)
      );
      //this.fields.filter((f) => f.id === e.target.id)[0].value = e.target.value;
    } else if (target.id === 'expYear') {
      // this.paymentMethod[e.target.id] = e.target.value;
      // console.log(`setting ${e.target.id} to ${e.target.value}`);
      // this.fields.filter((f) => f.id === e.target.id)[0].value =
      //   this.paymentMethod[e.target.id];
      this.args.creditCard.set('expYear', target.value);
    } else if (target.id === 'zipcode') {
      // this.paymentMethod[e.target.id] = e.target.value;
      // console.log(`setting ${e.target.id} to ${e.target.value}`);
      // this.fields.filter((f) => f.id === e.target.id)[0].value =
      //   this.paymentMethod[e.target.id];
      this.args.creditCard.set('zipcode', target.value);
    } else if (target.id === 'cvv') {
      // this.paymentMethod[e.target.id] = e.target.value;
      // console.log(`setting ${e.target.id} to ${e.target.value}`);
      // this.fields.filter((f) => f.id === e.target.id)[0].value =
      //   this.paymentMethod[e.target.id];
      this.args.creditCard.set('cvv', target.value);
    }

    this.formIsValid = !inputValidation(this.fields, ['cardIsValid']).isInvalid;
    this.shallNotPass = !(this.formIsValid && this.agreedToTermsAndConditions);
  }

  @action
  async savePaymentMethod() {
    this.isLoading = true;
    const user = await this.onboarding.fetchLocalModel('user');
    const subscription = await this.findOrCreateSubscription();

    //let paymentMethod;
    try {
      // if (isPresent(this.args.creditCard)) {
      //   paymentMethod = this.args.paymentMethod;
      //   paymentMethod.setProperties({
      //     ...this.paymentMethod,
      //     subscription,
      //     user,
      //   });
      // } else {
      //   paymentMethod = this.store.createRecord('credit-card', {
      //     ...this.paymentMethod,
      //     subscription,
      //     user,
      //   });
      // }
      this.args.creditCard.set('subscription', subscription);
      this.args.creditCard.set('user', user);

      await this.args.creditCard.save();
      await subscription.save();

      this.router.transitionTo(SIGNUP_ROUTE.WELCOME);
    } catch (e: any) {
      //this.errors = this.args.creditCard.errors;
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
