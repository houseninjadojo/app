import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { getWorkOrderStatusLabel } from 'houseninja/utils/components/work-order/work-order-status';
// import { isBlank } from '@ember/utils';

export default class ApprovePaymentRoute extends Route {
  @service current;
  @service router;
  @service store;

  async model({ auth_code }) {
    const workOrders = await this.store.findAll('work-order');
    const model = workOrders.filter((w) => w.authCode === 'asdf')[0];
    console.log('auth_code', auth_code);
    // const model = await this.store.queryRecord('work-order', {
    //   filter: { authCode: auth_code },
    // });

    // let paymentMethod = null;
    // if (isBlank(this.current.paymentMethod)) {
    //   await this.current.loadUser();
    //   paymentMethod = this.current.paymentMethod;
    // } else {
    //   paymentMethod = await this.store.findRecord(
    //     'payment-method',
    //     this.current.paymentMethod.id,
    //     { backgroundReload: true }
    //   );
    // }

    model?.setProperties({
      statusLabel: model.status && getWorkOrderStatusLabel(model.status),
      vendor: model.scheduledDate && model.vendor,
      // lastFour: paymentMethod.obfuscated.lastFour,
      // cardBrand: paymentMethod.obfuscated.brand,
    });

    return model;
  }
}
