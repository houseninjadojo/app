import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class WorkOrderRoute extends Route {
  @service current;
  @service router;
  @service store;

  async model({ work_order_id }) {
    // await this.current.loadUser();
    // const { paymentMethod } = this.current;

    return await this.store.findRecord('work-order', work_order_id, {
      include: 'invoice,invoice.payment',
    });

    // return {
    //   workOrder,
    //   paymentMethod,
    // };

    // model.setProperties({
    //   statusLabel: model.statusLabel,
    //   vendor: model.scheduledDate && model.vendor,
    //   lastFour: paymentMethod.obfuscated.lastFour,
    //   cardBrand: paymentMethod.obfuscated.brand,
    // });

    // return model;
  }
}
