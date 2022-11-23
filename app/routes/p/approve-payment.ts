import Route from '@ember/routing/route';
import { service } from '@ember/service';
import MetricsService from 'houseninja/services/metrics';
import CurrentService from 'houseninja/services/current';
import SessionService from 'houseninja/services/session';
import StoreService from 'houseninja/services/store';
import WorkOrder from 'houseninja/models/work-order';
import User from 'houseninja/models/user';
import Property from 'houseninja/models/property';

export default class ApprovePaymentRoute extends Route {
  @service declare current: CurrentService;
  @service declare metrics: MetricsService;
  @service declare session: SessionService;
  @service declare store: StoreService;

  async model(params: { access_token: string }): Promise<WorkOrder> {
    const { access_token } = params;

    await this.authenticate(access_token);
    const workOrder = await this.fetchWorkOrder(access_token);
    await this.identifyUser(workOrder);

    return workOrder;
  }

  /** authenticate user session */
  private async authenticate(access_token: string): Promise<void> {
    await this.session.authenticate(
      'authenticator:payment-approval',
      access_token
    );
  }

  /** fetch work order */
  private async fetchWorkOrder(access_token: string): Promise<WorkOrder> {
    return await this.store.findRecord('work-order', access_token, {
      include: [
        'invoice',
        'invoice.payment',
        'property',
        'property.user',
        'property.user.payment_methods',
      ].join(','),
    });
  }

  /** identify user to metrics */
  private async identifyUser(workOrder: WorkOrder): Promise<void> {
    const property: Property = await workOrder.property;
    const user: User = await property.user;
    user?.identifyToMetrics();
  }
}
