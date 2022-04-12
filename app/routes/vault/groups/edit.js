import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { NATIVE_MOBILE_ROUTE } from 'houseninja/data/enums/routes';

export default class VaultGroupsEditRoute extends Route {
  @service router;
  @service store;

  async model({ group_id }) {
    return await this.store.findRecord('document-group', group_id);
  }

  @action
  error(error, transition) {
    if (error.status === '404') {
      transition.abort();
      this.router.transitionTo(NATIVE_MOBILE_ROUTE.VAULT.INDEX);
    } else {
      // Let the route above this handle the error.
      return true;
    }
  }
}
