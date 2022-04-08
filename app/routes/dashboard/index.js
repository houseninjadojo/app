import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { NATIVE_MOBILE_ROUTE } from 'houseninja/data/enums/routes';

export default class DashboardIndexRoute extends Route {
  @service router;

  beforeModel() {
    this.router.transitionTo(NATIVE_MOBILE_ROUTE.DASHBOARD.HOME);
  }
}
