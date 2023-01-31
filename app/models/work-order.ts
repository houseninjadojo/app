import {
  WorkOrderStatus,
  WorkOrderUILabel,
} from 'houseninja/data/work-order-status';
import { getWorkOrderStatusLabel } from 'houseninja/utils/components/work-order/work-order-status';
import Model, { AsyncBelongsTo, attr, belongsTo } from '@ember-data/model';

import type Estimate from 'houseninja/models/estimate';
import type Invoice from './invoice';
import type Property from './property';

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

export default class WorkOrder extends Model {
  @belongsTo('estimate', { async: false, inverse: 'workOrder' })
  declare estimate: Estimate;

  @belongsTo('invoice', { async: false, inverse: 'workOrder' })
  declare invoice: Invoice;

  @belongsTo('property', { async: true, inverse: 'workOrders' })
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

  get statusLabel(): WorkOrderUILabel {
    return getWorkOrderStatusLabel(this.status);
  }

  get scheduledDateParsed(): Date | undefined {
    if (!this.scheduledDate) return;
    return dayjs(this.scheduledDate, 'MM/DD/YYYY').toDate();
  }

  get displayDate(): string {
    if (!this.vendor || !this.scheduledDateParsed) return '';
    return dayjs(this.scheduledDateParsed).format('MM/DD/YYYY');
  }

  get displayTime(): string {
    if (!this.vendor || !this.scheduledTime) return '';
    return this.scheduledTime;
  }
}
