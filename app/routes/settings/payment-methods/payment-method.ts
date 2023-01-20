import Route from '@ember/routing/route';
import { service } from '@ember/service';
import CreditCard from 'houseninja/models/credit-card';
import StoreService from 'houseninja/services/store';

type Params = { payment_method_id: string };

export default class SettingsPaymentMethodEditRoute extends Route {
  @service declare store: StoreService;

  async model({ payment_method_id }: Params): Promise<CreditCard> {
    return await this.store.findRecord('credit-card', payment_method_id, {
      reload: true,
    });
  }
}
