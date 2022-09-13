import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class WorkOrderRoute extends Route {
  @service current;
  @service router;
  @service store;

  async beforeModel() {
    try {
      await this.current.loadUser();
    } catch {
      return;
    }
  }

  async model({ work_order_id }) {
    await this.current.loadUser();

    return await this.store.findRecord('work-order', work_order_id, {
      include: [
        'estimates',
        'invoice',
        'invoice.payment',
        'invoice.document',
        'invoice.receipt',
        'property',
        'property.user',
        'property.user.payment_methods',
      ].join(','),
    });
  }
}
