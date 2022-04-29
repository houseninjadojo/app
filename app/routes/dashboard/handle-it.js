import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class DashboardHandleItRoute extends Route {
  @service store;

  model() {
    // // @todo replace wtih actual query
    // let query = {
    //   status: 'open',
    // };
    // return await this.store.query('work-order', {
    //   filter: query,
    // });

    return this.store.findAll('work-order', {
      backgroundReload: true,
    });
  }
}
