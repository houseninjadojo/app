import Route from '@ember/routing/route';
import { instrumentRoutePerformance } from '@sentry/ember';
import { service } from '@ember/service';
import { isBlank } from '@ember/utils';

class SettingsPaymentRoute extends Route {
  @service store;
  @service current;

  async model() {
    if (isBlank(this.current.paymentMethod)) {
      await this.current.loadUser();
      return this.current.paymentMethod;
    }
    return await this.store.findRecord(
      'payment-method',
      this.current.paymentMethod.id,
      { backgroundReload: true }
    );
  }
}

export default instrumentRoutePerformance(SettingsPaymentRoute);
