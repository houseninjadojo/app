import Route from '@ember/routing/route';

export default class DashboardIndexRoute extends Route {
  beforeModel() {
    this.transitionTo('dashboard.home');
  }
}
