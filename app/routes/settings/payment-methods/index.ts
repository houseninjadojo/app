import Route from '@ember/routing/route';
import { service } from '@ember/service';

import type CurrentService from 'houseninja/services/current';
import type StoreService from 'houseninja/services/store';
import type CreditCard from 'houseninja/models/credit-card';
import ArrayProxy from '@ember/array/proxy';

export default class SettingsPaymentMethodsRoute extends Route {
  @service declare store: StoreService;
  @service declare current: CurrentService;

  async model(): Promise<ArrayProxy<CreditCard>> {
    return await this.store.findAll('credit-card', {
      backgroundReload: true,
    });
  }
}
