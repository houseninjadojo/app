import { attr } from '@ember-data/model';
import PaymentMethod from './payment-method';
import { isPresent } from '@ember/utils';

export default class CreditCardModel extends PaymentMethod {
  @attr('string') brand;
  @attr('string') country;
  @attr('string') cvv;
  @attr('number') expMonth;
  @attr('number') expYear;
  @attr('string') cardNumber;
  @attr('string') zipcode;

  get obfuscated() {
    const brand = isPresent(this.brand) ? this.brand.toUpperCase() : null;
    return {
      brand,
      country: '',
      cvv: '',
      expMonth: null,
      expYear: null,
      cardNumber: '',
      zipcode: '',
      lastFour: isPresent(this.cardNumber)
        ? this.cardNumber.substring(this.cardNumber.length - 4)
        : '',
    };
  }
}
