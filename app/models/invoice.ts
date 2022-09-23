import Model, {
  AsyncBelongsTo,
  AsyncHasMany,
  attr,
  belongsTo,
  hasMany,
} from '@ember-data/model';
import { htmlSafe } from '@ember/template';
import { SafeString } from '@ember/template/-private/handlebars';

import type Document from './document';
import type LineItem from './line-item';
import type Payment from './payment';
import type PromoCode from './promo-code';
import type Subscription from './subscription';
import type User from './user';
import type WorkOrder from './work-order';

export default class InvoiceModel extends Model {
  @belongsTo('document', { async: false, inverse: 'invoice' })
  declare document: Document;

  @belongsTo('document', { async: false, inverse: 'invoice' })
  declare receipt: Document;

  @belongsTo('payment', { async: true, inverse: 'invoice' })
  declare payment: AsyncBelongsTo<Payment>;

  @belongsTo('promo-code', { async: true, inverse: 'invoices' })
  declare promoCode: AsyncBelongsTo<PromoCode>;

  @belongsTo('subscription', { async: true, inverse: 'invoices' })
  declare subscription: AsyncBelongsTo<Subscription>;

  @belongsTo('user', { async: true, inverse: 'invoices' })
  declare user: AsyncBelongsTo<User>;

  @belongsTo('work-order', { async: true, inverse: 'invoice' })
  declare workOrder: AsyncBelongsTo<WorkOrder>;

  @hasMany('line-item', { async: true, inverse: 'invoice' })
  declare lineItems: AsyncHasMany<LineItem>;

  @attr('string') declare description?: string;
  @attr('string') declare status: string;
  @attr('string') declare total?: string;
  @attr('string') declare formattedTotal?: string;

  @attr('date') declare periodStart?: Date;
  @attr('date') declare periodEnd?: Date;

  @attr('date') declare paymentAttemptedAt?: Date;

  @attr('date') declare createdAt: Date;
  @attr('date') declare updatedAt: Date;

  get formattedNotes(): string {
    if (this.description) {
      const description: string = this.description.replace(/\n/g, '<br/>');
      const safeDescription: SafeString = htmlSafe(description);
      return safeDescription.toString();
    } else {
      return '';
    }
  }
}
