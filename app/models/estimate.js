import Model, { attr, belongsTo } from '@ember-data/model';
import { typeOf } from '@ember/utils';

export default class EstimateModel extends Model {
  @belongsTo('work-order') workOrder;

  @attr('string') description;
  @attr('string') amount;

  @attr('string') vendorCategory;
  @attr('string') vendorName;

  @attr('date') approvedAt;
  @attr('date') scheduledWindowStart;
  @attr('date') scheduledWindowEnd;

  get isApproved() {
    return typeOf(this.approvedAt) === 'date';
  }
}
