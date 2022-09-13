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
  @attr('boolean') isDefault;

  get obfuscated() {
    const brand = isPresent(this.brand) ? this.brand.toUpperCase() : null;
    return {
      brand,
      country: '',
      cvv: '•••',
      expMonth: this.expMonth,
      expYear: this.expYear,
      cardNumber: '',
      zipcode: this.zipcode,
      lastFour: isPresent(this.cardNumber)
        ? `•••• ${this.cardNumber.substring(this.cardNumber.length - 4)}`
        : '',
    };
  }

  get lastFour() {
    if (isPresent(this.cardNumber)) {
      return this.cardNumber.substring(this.cardNumber.length - 4);
    } else {
      return '';
    }
  }

  get cardBrand() {
    if (isPresent(this.brand)) {
      return this.brand.toUpperCase();
    } else {
      return '';
    }
  }
}
