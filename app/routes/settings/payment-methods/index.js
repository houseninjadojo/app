import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class SettingsPaymentMethodsRoute extends Route {
  @service store;
  @service current;

  async model() {
    return await this.store.findAll('credit-card', {
      backgroundReload: true,
    });
  }
}
