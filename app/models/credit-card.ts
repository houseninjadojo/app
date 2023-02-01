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

export default class CreditCardModel extends PaymentMethod {
  @attr('string') declare brand?: string;
  @attr('string') declare country?: string;
  @attr('string') declare cvv?: string;
  @attr('number') declare expMonth: string;
  @attr('number') declare expYear: string;
  @attr('string') declare cardNumber: string;
  @attr('string') declare zipcode?: string;
  @attr('number') declare lastFour: number;

  get cardBrand(): string {
    return this.brand?.toUpperCase() ?? '';
  }
}
