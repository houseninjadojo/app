import { attr } from '@ember-data/model';
import PaymentMethod from './payment-method';

export default class CreditCard extends PaymentMethod {
  @attr('string') declare brand?: string;
  @attr('string') declare country?: string;
  @attr('string') declare cvv?: string;
  @attr('number') declare expMonth: string;
  @attr('number') declare expYear: string;
  @attr('string') declare cardNumber: string;
  @attr('string') declare zipcode?: string;
  @attr('number') declare lastFour: number;

  get cardBrand(): string {
    return this.brand?.toUpperCase() ?? 'Card';
  }

  get obfuscatedCardNumber(): string {
    return `XXXX-XXXX-XXXX-${this.lastFour}`;
  }
}
