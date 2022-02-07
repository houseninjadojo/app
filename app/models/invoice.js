import Model, { attr, belongsTo } from '@ember-data/model';

export default class InvoiceModel extends Model {
  @belongsTo('payment') payment;
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
