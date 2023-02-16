import Route from '@ember/routing/route';
import { instrumentRoutePerformance } from '@sentry/ember';
import RouterService from '@ember/routing/router-service';
import { service } from '@ember/service';
import isNativePlatform from 'houseninja/utils/is-native-platform';

class NotFoundRoute extends Route {
  @service declare router: RouterService;

  beforeModel() {
    if (isNativePlatform()) {
      this.router.transitionTo('index');
    }
  }
}

export default instrumentRoutePerformance(NotFoundRoute);
