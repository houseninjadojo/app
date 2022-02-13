import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class DashboardWorkHistoryRoute extends Route {
  @service current;
  @service store;

  async model() {
    return await this.store.query('work-order', {
      filter: {
        property: {
          id: this.current.property.id,
        },
      },
      page: {
        // offset: 0,
        number: 1,
        size: 20,
      },
    });
  }
}
