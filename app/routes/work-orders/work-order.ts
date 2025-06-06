import Route from '@ember/routing/route';
import { instrumentRoutePerformance } from '@sentry/ember';
import { service } from '@ember/service';

import type RouterService from '@ember/routing/router-service';
import type SessionService from 'ember-simple-auth/services/session';
import type StoreService from '@ember-data/store';

import WorkOrder from 'houseninja/models/work-order';
import Transition from '@ember/routing/transition';
import { AuthRoute } from 'houseninja/data/enums/routes';

type Params = {
  work_order_id: string;
};

class WorkOrderRoute extends Route {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @service declare current: any;
  @service declare router: RouterService;
  @service declare session: SessionService;
  @service declare store: StoreService;

  async beforeModel(transition: Transition): Promise<void> {
    this.session.requireAuthentication(transition, AuthRoute.LoginOrSignup);
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

export default instrumentRoutePerformance(WorkOrderRoute);
