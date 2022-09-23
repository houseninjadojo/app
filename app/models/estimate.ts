import Model, { attr, belongsTo, type AsyncBelongsTo } from '@ember-data/model';
import { typeOf } from '@ember/utils';
import { htmlSafe } from '@ember/template';
import { SafeString } from '@ember/template/-private/handlebars';

import type WorkOrder from './work-order';

export default class EstimateModel extends Model {
  @belongsTo('work-order', { async: true, inverse: 'estimate' })
  declare workOrder: AsyncBelongsTo<WorkOrder>;

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

  get formattedNotes(): SafeString {
    if (this.description) {
      const description: string = this.description.replace(/\n/g, '<br/>');
      const safeDescription: SafeString = htmlSafe(description);
      return safeDescription;
    } else {
      return new SafeString('');
    }
  }
}
