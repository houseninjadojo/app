import { attr } from '@ember-data/model';
import PaymentMethod from './payment-method';

export default class CreditCardModel extends PaymentMethod {
  @attr('string') brand;
  @attr('string') country;
  @attr('string') cvv;
  @attr('number') expMonth;
  @attr('number') expYear;
  @attr('string') number;
  @attr('string') zipcode;
}
