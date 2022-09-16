import Route from '@ember/routing/route';
import { service } from '@ember/service';

import type RouterService from '@ember/routing/router-service';
import type StoreService from '@ember-data/store';
import type SessionService from 'ember-simple-auth/services/session';

import type WorkOrder from 'houseninja/models/work-order';

type Params = {
  access_token: string;
};

export default class ExternalApproveEstimateRoute extends Route {
  @service declare router: RouterService;
  @service declare session: SessionService;
  @service declare store: StoreService;

  async model({ access_token }: Params): Promise<WorkOrder | undefined> {
    await this.session.authenticate(
      'authenticator:payment-approval',
      access_token
    );

    return await this.store.findRecord('work-order', access_token, {
      include: 'estimates,property,property.user',
    });
  }
}
