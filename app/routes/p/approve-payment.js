import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class ApprovePaymentRoute extends Route {
  @service current;
  @service router;
  @service store;

  model({ access_token }) {
    return this.store
      .findRecord('invoice', access_token, {
        include: [
          // 'payment',
          'work_order',
          'work_order.property',
          'work_order.property.user',
          'work_order.property.user.payment_methods',
        ].join(','),
      })
      .then((invoice) => {
        return invoice.get('work-order');
      });

    // return {
    //   invoice,
    //   workOrder: invoice.get('workOrder'),
    //   property: invoice.get('workOrder.property'),
    //   user: invoice.get('workOrder.property.user'),
    //   paymentMethod: invoice.get(
    //     'workOrder.property.user.paymentMethods.firstObject'
    //   ),
    //   statusLabel: invoice.get('workOrder.statusLabel'),
    //   vendor: invoice.get('workOrder.vendor'),
    //   formattedTotal: invoice.formattedTotal,
    // };
  }
}
