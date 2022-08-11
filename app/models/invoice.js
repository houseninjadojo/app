import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import { htmlSafe } from '@ember/template';

export default class InvoiceModel extends Model {
  @belongsTo('document', { async: false }) document;
  @belongsTo('document', { async: false }) receipt;
  @belongsTo('payment') payment;
  @belongsTo('promo-code') promoCode;
  @belongsTo('subscription') subscription;
  @belongsTo('user') user;
  @belongsTo('work-order') workOrder;
  @hasMany('line-item') lineItems;

  @attr('string') description;
  @attr('string') status;
  @attr('string') total;
  @attr('string') formattedTotal;

  @attr('date') periodStart;
  @attr('date') periodEnd;

  @attr('date') paymentAttemptedAt;

  @attr('date') createdAt;
  @attr('date') updatedAt;

  get formattedNotes() {
    if (this.description) {
      return htmlSafe(this.description.replace(/\n/g, '<br/>'));
    } else {
      return null;
    }
  }
}
