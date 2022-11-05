import Route from '@ember/routing/route';
import { service } from '@ember/service';
import type StoreService from 'houseninja/services/store';

export default class DashboardHandleItRoute extends Route {
  @service declare store: StoreService;

  async model() {
    return await this.store.findAll('work-order', {
      backgroundReload: true,
      include: 'estimate,invoice',
    });
  }
}
