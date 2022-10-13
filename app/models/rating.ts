import Model, { AsyncBelongsTo, attr, belongsTo } from '@ember-data/model';

import type User from './user';
import type WorkOrder from './work-order';

export default class RatingModel extends Model {
  @belongsTo('work-order', { async: true, inverse: 'rating' })
  declare workOrder: AsyncBelongsTo<WorkOrder>;

  @belongsTo('user', { async: true, inverse: 'ratings' })
  declare user: AsyncBelongsTo<User>;

  @attr('number') declare vendorRating?: number;
  @attr('number') declare npsRating?: number;
  @attr('string') declare vendorTextAreaCapture?: string;
  @attr('string') declare npsTextAreaCapture?: string;
}
