import { attr } from '@ember-data/model';
import { isPresent } from '@ember/utils';
import PaymentMethod from './payment-method';

interface CreditCardArgs {
  isDefault?: boolean;
  brand?: string;
  country?: string;
  cvv?: string;
  expMonth?: string;
  expYear?: string;
  cardNumber: string;
  zipcode?: string;
  lastFour?: string;
}

export default class CreditCardModel extends PaymentMethod {
  @attr('boolean') declare isDefault: boolean;
  @attr('string') declare brand?: string;
  @attr('string') declare country?: string;
  @attr('string') declare cvv?: string;
  @attr('number') declare expMonth: string;
  @attr('number') declare expYear: string;
  @attr('string') declare cardNumber: string;
  @attr('string') declare zipcode?: string;

  get obfuscated(): CreditCardArgs {
    return {
      brand: this.cardBrand,
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
    return this.cardNumber.substring(this.cardNumber.length - 4) ?? '';
  }

  get cardBrand() {
    if (isPresent(this.brand)) {
      return this.brand?.toUpperCase();
    } else {
      return 'CARD';
    }
  }
}
