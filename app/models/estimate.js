import Model, { attr, belongsTo } from '@ember-data/model';

export default class EstimateModel extends Model {
  @belongsTo('work-order') workOrder;

  @attr('string') description;
  @attr('string') amount;

  @attr('string') vendorCategory;
  @attr('string') vendorName;

  @attr('date') approvedAt;
  @attr('date') scheduledWindowStart;
  @attr('date') scheduledWindowEnd;
}
