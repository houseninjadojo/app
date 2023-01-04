import Route from '@ember/routing/route';
import { service } from '@ember/service';
import type StoreService from '@ember-data/store';

// eslint-disable-next-line ember/use-ember-data-rfc-395-imports
import DS from 'ember-data';
import type ServiceCategoryModel from 'houseninja/models/service-category';

export default class WorkOrderCreateRoute extends Route {
  @service declare store: StoreService;

  model(): DS.PromiseArray<ServiceCategoryModel> {
    return this.store.findAll('service-category');
  }
}
