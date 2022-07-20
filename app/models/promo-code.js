import Model, { attr, hasMany } from '@ember-data/model';
import { isPresent } from '@ember/utils';

export default class PromoCodeModel extends Model {
  @hasMany('invoice') invoices;
  @hasMany('subscription') subscriptions;
  @hasMany('user') users;

  @attr('boolean') active;

  @attr('string') code;
  @attr('string') name;
  @attr('string') amountOff;
  @attr('string') percentOff;

  @attr('string') duration;
  @attr('number') durationInMonths;

  @attr('date') createdAt;
  @attr('date') updatedAt;

  /**
   * Returns the description of the promo code.
   *
   * @example
   *   const params = {
   *     amountOff: null,
   *     percentOff: '10.0',
   *     durationInMonths: 2,
   *     duration: 'repeating',
   *   }
   *   new PromoCode(params).description; // => '10% off for 2 months'
   *
   * @returns {string}
   */
  get description() {
    const wordMonths = this.durationInMonths === 1 ? 'month' : 'months';
    const numMonths = isPresent(this.durationInMonths)
      ? this.durationInMonths
      : 0;
    const wordDiscount = isPresent(this.amountOff)
      ? '$' + this.amountOff
      : this.percentOff + '%';
    const firstHalf = `${wordDiscount} off`;
    const secondHalf = numMonths > 0 ? ` for ${numMonths} ${wordMonths}` : '';
    return `${firstHalf}${secondHalf}`;
  }
}
