import Route from '@ember/routing/route';
import RouterService from '@ember/routing/router-service';
import { service } from '@ember/service';
import { NATIVE_MOBILE_ROUTE } from 'houseninja/data/enums/routes';

export default class DashboardIndexRoute extends Route {
  @service declare router: RouterService;

  async beforeModel(): Promise<void> {
    await this.router.transitionTo(NATIVE_MOBILE_ROUTE.DASHBOARD.HOME);
  }
}
