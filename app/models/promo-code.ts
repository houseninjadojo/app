import Model, { AsyncHasMany, attr, hasMany } from '@ember-data/model';
import { isPresent } from '@ember/utils';

import type Invoice from './invoice';
import type Subscription from './subscription';
import type User from './user';

export default class PromoCodeModel extends Model {
  @hasMany('invoice', { async: true })
  declare invoices: AsyncHasMany<Invoice>;

  @hasMany('subscription', { async: true })
  declare subscriptions: AsyncHasMany<Subscription>;

  @hasMany('user', { async: true })
  declare users: AsyncHasMany<User>;

  @attr('boolean') declare active: boolean;

  @attr('string') declare code: string;
  @attr('string') declare name?: string;
  @attr('string') declare amountOff?: string;
  @attr('string') declare percentOff?: string;

  @attr('string') declare duration?: string;
  @attr('number') declare durationInMonths?: number;

  @attr('date') declare createdAt: Date;
  @attr('date') declare updatedAt: Date;

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
  get description(): string {
    const wordMonths: string = this.durationInMonths === 1 ? 'month' : 'months';
    const numMonths: number = this.durationInMonths ?? 0;
    const wordDiscount: string = isPresent(this.amountOff)
      ? `$${this.amountOff}`
      : `${this.percentOff}%`;
    const firstHalf = `${wordDiscount} off`;
    const secondHalf: string =
      numMonths > 0 ? ` for ${numMonths} ${wordMonths}` : '';
    return `${firstHalf}${secondHalf}`;
  }
}
