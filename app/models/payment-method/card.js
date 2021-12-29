import { attr } from '@ember-data/model';
import PaymentMethod from './index';

export default class CardModel extends PaymentMethod {
  @attr('string') brand;
  @attr('string') country;
  @attr('string') cvv;
  @attr('number') expMonth;
  @attr('number') expYear;
  @attr('string') number;
}
