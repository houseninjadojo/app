import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { isBlank } from '@ember/utils';

export default class SettingsPaymentRoute extends Route {
  @service store;
  @service current;

  async model() {
    if (isBlank(this.current.paymentMethod)) {
      await this.current.loadUser();
      return this.current.paymentMethod.reload();
    }
    return await this.store.findRecord(
      'payment-method',
      this.current.paymentMethod.id,
      { reload: true }
    );
  }
}
