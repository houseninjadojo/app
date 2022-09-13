import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class SettingsPaymentMethodEditRoute extends Route {
  @service store;

  async model({ payment_method_id }) {
    return await this.store.findRecord('credit-card', payment_method_id, {
      reload: true,
    });
  }
}
