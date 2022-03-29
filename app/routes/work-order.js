import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { getWorkOrderStatusLabel } from 'houseninja/utils/components/work-order/work-order-status';

export default class WorkOrderRoute extends Route {
  @service router;
  @service store;

  async model({ work_order_id }) {
    const model = await this.store.findRecord('work-order', work_order_id, {
      backgroundReload: true,
    });
    model.setProperties({
      statusLabel: model.status && getWorkOrderStatusLabel(model.status),
      vendor: model.scheduledDate && model.vendor,
    });
    return model;
  }
}
