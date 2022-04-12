import Route from '@ember/routing/route';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { isPresent } from '@ember/utils';
import RSVP from 'rsvp';
import { NATIVE_MOBILE_ROUTE } from 'houseninja/data/enums/routes';

export default class VaultDocumentEditRoute extends Route {
  @service router;
  @service store;

  groups = [];

  model({ document_id }) {
    return RSVP.hash({
      groups: this.store.findAll('document-group'),
      document: this.store.findRecord('document', document_id, {
        include: 'document_group',
      }),
      media: null,
    });
  }

  @action
  error(error, transition) {
    if (isPresent(error.errors?.findBy('status', '404'))) {
      transition.abort();
      this.router.transitionTo(NATIVE_MOBILE_ROUTE.VAULT.INDEX);
    }
  }
}
