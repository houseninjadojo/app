import ArrayProxy from '@ember/array/proxy';
import Route from '@ember/routing/route';
import { instrumentRoutePerformance } from '@sentry/ember';
import { service } from '@ember/service';
import WorkOrder from 'houseninja/models/work-order';
import StoreService from 'houseninja/services/store';

class DashboardWorkHistoryRoute extends Route {
  @service declare store: StoreService;

  async model(): Promise<ArrayProxy<WorkOrder>> {
    return await this.store.findAll('work-order', {
      backgroundReload: true,
    });
  }
}

export default instrumentRoutePerformance(DashboardWorkHistoryRoute);
