import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class DashboardHandleItRoute extends Route {
  @service store;

  async model() {
    // // @todo replace wtih actual query
    // let query = {
    //   status: 'open',
    // };
    // return await this.store.query('work-order', {
    //   filter: query,
    // });
    return await this.store.findAll('work-order', {
      backgroundReload: true,
      include: 'estimate,invoice',
    });
  }
}
