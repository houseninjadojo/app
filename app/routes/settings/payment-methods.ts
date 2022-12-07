import Route from '@ember/routing/route';
import { SettingsRoute } from 'houseninja/data/enums/routes';
import { service } from '@ember/service';

import RouterService from '@ember/routing/router-service';

export default class SettingsPaymentMethodsRoute extends Route {
  @service declare router: RouterService;

  beforeModel(): void {
    this.router.transitionTo(SettingsRoute.PaymentMethods);
  }
}
