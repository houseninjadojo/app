import Model, { attr, belongsTo } from '@ember-data/model';

export default class WorkOrderModel extends Model {
  @belongsTo('property') property;

  @attr('string') status;
  @attr('string') description;
  @attr('string') vendor;

  @attr('string') scheduledDate;
  @attr('string') scheduledTime;
}
