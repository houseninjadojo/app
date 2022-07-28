import Model, { attr, belongsTo } from '@ember-data/model';
import { getWorkOrderStatusLabel } from 'houseninja/utils/components/work-order/work-order-status';

export default class WorkOrderModel extends Model {
  @belongsTo('invoice', { async: false }) invoice;
  @belongsTo('property') property;

  @attr('string') authCode;
  @attr('date') createdAt;
  @attr('date') updatedAt;
  @attr('date') completedAt;
  @attr('string') cost;
  @attr('string') description;
  @attr('string') scheduledDate;
  @attr('string') scheduledTime;
  @attr('string') status;
  @attr('string') vendor;

  get statusLabel() {
    return getWorkOrderStatusLabel(this.status);
  }
}
