import Route from '@ember/routing/route';
import { instrumentRoutePerformance } from '@sentry/ember';
import { NATIVE_MOBILE_ROUTE } from 'houseninja/data/enums/routes';

class VaultGroupsEditRoute extends Route {
  model() {
    return this.modelFor(NATIVE_MOBILE_ROUTE.VAULT.GROUPS.SHOW);
  }
}

export default instrumentRoutePerformance(VaultGroupsEditRoute);
