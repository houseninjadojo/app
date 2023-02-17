import Route from '@ember/routing/route';
import { instrumentRoutePerformance } from '@sentry/ember';
import { service } from '@ember/service';
import type StoreService from 'houseninja/services/store';

class DashboardHandleItRoute extends Route {
  @service declare store: StoreService;

  async model() {
    return await this.store.findAll('work-order', {
      backgroundReload: true,
      include: 'estimate,invoice',
    });
  }
}

export default instrumentRoutePerformance(DashboardHandleItRoute);
