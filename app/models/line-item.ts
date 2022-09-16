import Model, { AsyncBelongsTo, attr, belongsTo } from '@ember-data/model';

import type Invoice from './invoice';

export default class LineItemModel extends Model {
  @belongsTo('invoice', { async: true, inverse: 'lineItems' })
  declare invoice: AsyncBelongsTo<Invoice>;

  @attr('string') declare amount?: string;
  @attr('string') declare description?: string;
  @attr('string') declare name?: string;
  @attr('string') declare quantity?: string;
}
