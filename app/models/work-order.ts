import Model, {
  AsyncBelongsTo,
  AsyncHasMany,
  attr,
  belongsTo,
  hasMany,
} from '@ember-data/model';
import { getWorkOrderStatusLabel } from 'houseninja/utils/components/work-order/work-order-status';
import {
  WorkOrderStatus,
  WorkOrderUILabel,
} from 'houseninja/data/work-order-status';

import type Estimate from './estimate';
import type Invoice from './invoice';
import type Property from './property';

export default class WorkOrderModel extends Model {
  @belongsTo('invoice', { async: false, inverse: 'workOrder' })
  declare invoice: AsyncBelongsTo<Invoice>;

  @belongsTo('property', { async: true, inverse: 'workOrders' })
  declare property: AsyncBelongsTo<Property>;

  @hasMany('estimate', { async: true, inverse: 'workOrder' })
  declare estimates: AsyncHasMany<Estimate>;

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
