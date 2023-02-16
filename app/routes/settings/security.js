import Route from '@ember/routing/route';
import { instrumentRoutePerformance } from '@sentry/ember';
import { service } from '@ember/service';

class SettingsSecurityRoute extends Route {
  @service store;
}

export default instrumentRoutePerformance(SettingsSecurityRoute);
