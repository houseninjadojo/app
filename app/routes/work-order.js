import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { getWorkOrderStatusLabel } from 'houseninja/utils/components/work-order/work-order-status';
import { isBlank } from '@ember/utils';

export default class WorkOrderRoute extends Route {
  @service current;
  @service router;
  @service store;

  async model({ work_order_id }) {
    let paymentMethod = null;
    if (isBlank(this.current.paymentMethod)) {
      await this.current.loadUser();
      paymentMethod = this.current.paymentMethod;
    } else {
      paymentMethod = await this.store.findRecord(
        'payment-method',
        this.current.paymentMethod.id,
        { backgroundReload: true }
      );
    }

    const model = await this.store.findRecord('work-order', work_order_id, {
      backgroundReload: true,
    });

    model.setProperties({
      statusLabel: model.status && getWorkOrderStatusLabel(model.status),
      vendor: model.scheduledDate && model.vendor,
      lastFour: paymentMethod.obfuscated.lastFour,
      cardBrand: paymentMethod.obfuscated.brand,
    });
    return model;
  }
}
