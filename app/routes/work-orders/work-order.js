import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class WorkOrderRoute extends Route {
  @service current;
  @service router;
  @service store;

  async model({ work_order_id }) {
    await this.current.loadUser();

    const workOrder = await this.store.findRecord('work-order', work_order_id, {
      include: [
        'invoices',
        'invoices.payment',
        'property',
        'property.user',
        'property.user.payment_methods',
      ].join(','),
    });

    const invoice = await workOrder.get('invoices.firstObject');
    const property = await workOrder.get('property');
    const { user, paymentMethod } = this.current;

    return {
      workOrder,
      invoice,
      user,
      paymentMethod,
      property,
      statusLabel: workOrder.statusLabel,
      vendor: workOrder.vendor,
      formattedTotal: invoice.formattedTotal,
    };
  }
}
