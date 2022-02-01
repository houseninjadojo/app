import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { task } from 'ember-concurrency';

export default class DashboardHandleItRoute extends Route {
  @service store;

  model() {
    // @todo replace wtih actual query
    let query = {
      status: 'open',
    };
    return this.fetchWorkOrders.perform(query);
  }

  @task({ keepLatest: true })
  *fetchWorkOrders(query) {
    return yield this.store.query('work-order', {
      filter: query,
    });
  }
}
