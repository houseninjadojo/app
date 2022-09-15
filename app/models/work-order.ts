import Model, { AsyncBelongsTo, attr, belongsTo } from '@ember-data/model';
import { getWorkOrderStatusLabel } from 'houseninja/utils/components/work-order/work-order-status';
import {
  WorkOrderStatus,
  WorkOrderUIState,
} from 'houseninja/data/work-order-status';

import type Invoice from './invoice';
import type Property from './property';

export default class WorkOrderModel extends Model {
  @belongsTo('invoice', { async: false })
  declare invoice: AsyncBelongsTo<Invoice>;

  @belongsTo('property', { async: true })
  declare property: AsyncBelongsTo<Property>;

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

  get statusLabel(): WorkOrderUIState {
    return getWorkOrderStatusLabel(this.status);
  }
}
