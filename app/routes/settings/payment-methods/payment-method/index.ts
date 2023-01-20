import Route from '@ember/routing/route';
import { PaymentMethodsSettingsRoute } from 'houseninja/data/enums/routes';

import PaymentMethod from 'houseninja/models/payment-method';

export default class SettingsPaymentMethodIndexRoute extends Route {
  model(): PaymentMethod {
    return this.modelFor(
      PaymentMethodsSettingsRoute.PaymentMethod
    ) as PaymentMethod;
  }
}
