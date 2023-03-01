import Route from '@ember/routing/route';
import { instrumentRoutePerformance } from '@sentry/ember';
import { service } from '@ember/service';
import { isBlank } from '@ember/utils';
import { AuthRoute } from 'houseninja/data/enums/routes';
import type CurrentService from 'houseninja/services/current';
import type StoreService from '@ember-data/store';
import type SessionService from 'houseninja/services/session';
import type Transition from '@ember/routing/transition';

class SettingsPaymentRoute extends Route {
  @service declare current: CurrentService;
  @service declare session: SessionService;
  @service declare store: StoreService;

  async beforeModel(transition: Transition): Promise<void> {
    return this.session.requireAuthentication(
      transition,
      AuthRoute.LoginOrSignup
    );
  }

  async model() {
    if (isBlank(this.current.paymentMethod)) {
      await this.current.loadUser();
      return this.current.paymentMethod;
    }
    return await this.store.findRecord(
      'payment-method',
      this.current.paymentMethod.id,
      { backgroundReload: true }
    );
  }
}

export default instrumentRoutePerformance(SettingsPaymentRoute);
