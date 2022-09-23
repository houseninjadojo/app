import Route from '@ember/routing/route';
import { service } from '@ember/service';

import type RouterService from '@ember/routing/router-service';
import type StoreService from '@ember-data/store';

import WorkOrder from 'houseninja/models/work-order';

type Params = {
  work_order_id: string;
};

export default class WorkOrderRoute extends Route {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @service declare current: any;
  @service declare router: RouterService;
  @service declare store: StoreService;

  async beforeModel(): Promise<void> {
    try {
      await this.current.loadUser();
    } catch {
      return;
    }
  }

  async model({ work_order_id }: Params): Promise<WorkOrder> {
    await this.current.loadUser();

    return await this.store.findRecord('work-order', work_order_id, {
      include: [
        'estimate',
        'invoice',
        'invoice.payment',
        'invoice.document',
        'invoice.receipt',
        'property',
        'property.user',
        'property.user.payment_methods',
      ].join(','),
    });
  }
}
