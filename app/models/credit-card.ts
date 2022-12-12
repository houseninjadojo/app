import { attr } from '@ember-data/model';
import PaymentMethod from './payment-method';

interface CreditCardArgs {
  brand?: string;
  country?: string;
  cvv?: string;
  expMonth?: string;
  expYear?: string;
  cardNumber: string;
  zipcode?: string;
  lastFour?: string;
}

export default class CreditCard extends PaymentMethod {
  @attr('string') declare brand?: string;
  @attr('string') declare country?: string;
  @attr('string') declare cvv?: string;
  @attr('number') declare expMonth: string;
  @attr('number') declare expYear: string;
  @attr('string') declare cardNumber: string;
  @attr('string') declare zipcode?: string;

  get obfuscated(): CreditCardArgs {
    const brand = this.brand?.toUpperCase();
    return {
      brand,
      country: '',
      cvv: '',
      expMonth: undefined,
      expYear: undefined,
      cardNumber: '',
      zipcode: '',
      lastFour: this.cardNumber?.substring(this.cardNumber.length - 4) ?? '',
    };
  }

  get lastFour() {
    return this.cardNumber.substring(this.cardNumber.length - 4) ?? '';
  }

  get cardBrand() {
    return this.brand?.toUpperCase() ?? '';
  }
}
