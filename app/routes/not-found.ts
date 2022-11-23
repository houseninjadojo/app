import Route from '@ember/routing/route';
import RouterService from '@ember/routing/router-service';
import { service } from '@ember/service';
import isNativePlatform from 'houseninja/utils/is-native-platform';

export default class NotFoundRoute extends Route {
  @service declare router: RouterService;

  beforeModel() {
    if (isNativePlatform()) {
      this.router.transitionTo('index');
    }
  }
}
