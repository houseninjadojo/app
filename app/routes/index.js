import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class IndexRoute extends Route {
  @service session;
  @service store;

  model() {
    return this.store.findAll('home', { include: 'address' });
  }
}
