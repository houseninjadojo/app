import Route from '@ember/routing/route';
import { instrumentRoutePerformance } from '@sentry/ember';
import RouterService from '@ember/routing/router-service';
import { service } from '@ember/service';
import { DashboardRoute } from 'houseninja/data/enums/routes';

class DashboardIndexRoute extends Route {
  @service declare router: RouterService;

  async beforeModel(): Promise<void> {
    await this.router.transitionTo(DashboardRoute.Home);
  }
}

export default instrumentRoutePerformance(DashboardIndexRoute);
