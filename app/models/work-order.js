import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import { getWorkOrderStatusLabel } from 'houseninja/utils/components/work-order/work-order-status';

export default class WorkOrderModel extends Model {
  @hasMany('invoice') invoices;
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

  get invoice() {
    return this.invoices.get('firstObject');
  }
}
