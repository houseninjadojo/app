import Model, { attr, belongsTo } from '@ember-data/model';
import { typeOf } from '@ember/utils';

import type { AsyncBelongsTo } from '@ember-data/model';
// import type WorkOrder from './work-order';

export default class EstimateModel extends Model {
  @belongsTo('work-order', { async: true })
  declare workOrder: AsyncBelongsTo<any>;

  @attr('string') declare description?: string;
  @attr('string') declare amount: string;

  @attr('string') declare vendorCategory?: string;
  @attr('string') declare vendorName: string;

  @attr('date') declare approvedAt?: Date;
  @attr('date') declare scheduledWindowStart?: Date;
  @attr('date') declare scheduledWindowEnd?: Date;

  get isApproved(): boolean {
    return typeOf(this.approvedAt) === 'date';
  }
}
