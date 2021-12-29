import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class HomeRoute extends Route {
  @service current;

  model() {
    return this.current;
  }
}
