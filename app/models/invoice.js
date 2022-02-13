import Model, { attr, belongsTo } from '@ember-data/model';

export default class InvoiceModel extends Model {
  @belongsTo('document') document;
  @belongsTo('payment') payment;
  @belongsTo('promo-code') promoCode;
  @belongsTo('subscription') subscription;
  @belongsTo('user') user;

  @attr('string') description;
  @attr('string') status;
  @attr('string') total;

  @attr('date') periodStart;
  @attr('date') periodEnd;

  @attr('date') createdAt;
  @attr('date') updatedAt;
}
