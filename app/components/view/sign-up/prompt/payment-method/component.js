import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { debug } from '@ember/debug';
import * as Sentry from '@sentry/ember';

export default class PaymentMethodComponent extends Component {
  stripeElement = null;

  @service current;
  @service router;
  @service store;
  @service('stripev3') stripe;

  @tracked agreesToTermsAndConditions;
  @tracked promoCode;

  /**
   * When you are creating your own form, you will need access to
   * the Stripe Elements object that links all the individual inputs.
   */
  @action
  handleReady(stripeElement) {
    this.stripeElement = stripeElement;
  }

  @action
  async savePaymentMethod() {
    try {
      let user = this.store.peekAll('user').get('firstObject');

      let { paymentMethod } = await this.stripe.createPaymentMethod({
        type: 'card',
        card: this.stripeElement,
      });

      let creditCard = this.store.createRecord('credit-card', {
        user,
        stripeToken: paymentMethod.id,
        brand: paymentMethod.card.brand,
        country: paymentMethod.card.country,
        expMonth: paymentMethod.card.exp_month,
        expYear: paymentMethod.card.exp_year,
        lastFour: paymentMethod.card.last4,
        zipcode: paymentMethod.billing_details.address.postal_code,
      });
      await creditCard.save();

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
