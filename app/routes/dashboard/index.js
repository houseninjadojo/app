import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class DashboardIndexRoute extends Route {
  @service router;

  beforeModel() {
    this.router.transitionTo('dashboard.home');
  }
}
