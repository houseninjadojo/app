import Route from '@ember/routing/route';
import { NATIVE_MOBILE_ROUTE } from 'houseninja/data/enums/routes';

export default class SettingsPaymentMethodEditRoute extends Route {
  model() {
    return this.modelFor(
      NATIVE_MOBILE_ROUTE.SETTINGS.PAYMENT_METHODS.PAYMENT_METHOD.SHOW
    );
  }
}
