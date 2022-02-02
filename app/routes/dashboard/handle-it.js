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
    // spawn refresh
    this.refreshModel.perform(query);
    return this.store.peekAll('work-order');
  }

  @task({ keepLatest: true })
  *fetchWorkOrders(query) {
    try {
      return yield this.store.query('work-order', {
        filter: query,
      });
    } catch (e) {
      return yield this.store.peekAll('work-order');
    }
  }

  @task({ drop: true }) *refreshModel(query) {
    yield this.store.query('work-order', {
      filter: query,
    });
  }
}
