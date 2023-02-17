import Route from '@ember/routing/route';
import { instrumentRoutePerformance } from '@sentry/ember';
import { service } from '@ember/service';
import StoreService from 'houseninja/services/store';
import RouterService from '@ember/routing/router-service';

class VaultGroupsNewRoute extends Route {
  @service declare router: RouterService;
  @service declare store: StoreService;

  model(): void {
    // return this.store.createRecord('document-group');
  }
}

export default instrumentRoutePerformance(VaultGroupsNewRoute);
