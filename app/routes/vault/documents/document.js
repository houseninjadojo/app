import Route from '@ember/routing/route';
import { instrumentRoutePerformance } from '@sentry/ember';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { isPresent } from '@ember/utils';
import { NATIVE_MOBILE_ROUTE } from 'houseninja/data/enums/routes';

class VaultDocumentsShowRoute extends Route {
  @service router;
  @service store;

  async model({ document_id }) {
    return await this.store.findRecord('document', document_id, {
      include: 'document_group',
    });
  }

  @action
  error(error, transition) {
    if (isPresent(error.errors.findBy('status', '404'))) {
      transition.abort();
      this.router.transitionTo(NATIVE_MOBILE_ROUTE.VAULT.INDEX);
    } else {
      // Let the route above this handle the error.
      return true;
    }
  }
}

export default instrumentRoutePerformance(VaultDocumentsShowRoute);
