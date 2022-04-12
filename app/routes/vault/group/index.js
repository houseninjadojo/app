import Route from '@ember/routing/route';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { NATIVE_MOBILE_ROUTE } from 'houseninja/data/enums/routes';

export default class VaultGroupIndexRoute extends Route {
  @service router;
  @service store;

  documents = [];

  async model({ group_id }) {
    return await this.store.findRecord('document-group', group_id, {
      include: 'documents',
    });
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
