import Model, { AsyncBelongsTo, attr, belongsTo } from '@ember-data/model';
import { getWorkOrderStatusLabel } from 'houseninja/utils/components/work-order/work-order-status';
import {
  WorkOrderStatus,
  WorkOrderUILabel,
} from 'houseninja/data/work-order-status';

import type Estimate from './estimate';
import type Invoice from './invoice';
import type Rating from './rating';
import type Property from './property';

export default class WorkOrderModel extends Model {
  @belongsTo('estimate', { async: false, inverse: 'workOrder' })
  declare estimate: Estimate;

  @belongsTo('invoice', { async: false, inverse: 'workOrder' })
  declare invoice: Invoice;

  @belongsTo('property', { async: true, inverse: 'workOrders' })
  declare property: AsyncBelongsTo<Property>;

  @belongsTo('rating', { async: false, inverse: 'workOrder' })
  declare rating: Rating;

  @attr('string') declare authCode?: string;
  @attr('string') declare cost?: string;
  @attr('string') declare description?: string;
  @attr('string') declare scheduledDate?: string;
  @attr('string') declare scheduledTime?: string;
  @attr('string') declare status: WorkOrderStatus;
  @attr('string') declare vendor?: string;

  @attr('date') declare completedAt?: Date;

  @attr('date') declare createdAt: Date;
  @attr('date') declare updatedAt: Date;

  get statusLabel(): WorkOrderUILabel {
    return getWorkOrderStatusLabel(this.status);
  }
}
