import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class WorkOrderRoute extends Route {
  @service router;
  @service store;

  async model({ work_order_id }) {
    const model = await this.store.findRecord('work-order', work_order_id, {
      backgroundReload: true,
    });
    return model;
  }
}
