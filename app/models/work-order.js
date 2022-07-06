import Model, { attr, belongsTo } from '@ember-data/model';
import { getWorkOrderStatusLabel } from 'houseninja/utils/components/work-order/work-order-status';

export default class WorkOrderModel extends Model {
  @belongsTo('invoice', { async: false }) invoice;
  @belongsTo('property') property;

  @attr('string') description;
  @attr('string') vendor;

  @attr('string') scheduledDate;
  @attr('string') scheduledTime;

  @attr('string') status;

  @attr('string') authCode;

  get statusLabel() {
    return getWorkOrderStatusLabel(this.status);
  }
}
