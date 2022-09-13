import Route from '@ember/routing/route';
import { NATIVE_MOBILE_ROUTE } from 'houseninja/data/enums/routes';
import { service } from '@ember/service';

export default class SettingsPaymentMethodsRoute extends Route {
  @service router;

  beforeModel() {
    this.router.transitionTo(
      NATIVE_MOBILE_ROUTE.SETTINGS.PAYMENT_METHODS.INDEX
    );
  }
}
