import Route from '@ember/routing/route';
import { service } from '@ember/service';
import RSVP from 'rsvp';
import { NATIVE_MOBILE_ROUTE } from 'houseninja/data/enums/routes';

export default class VaultDocumentsEditRoute extends Route {
  @service router;
  @service store;

  groups = [];

  model() {
    return RSVP.hash({
      groups: this.store.findAll('document-group'),
      document: this.modelFor(NATIVE_MOBILE_ROUTE.VAULT.DOCUMENTS.SHOW),
      media: null,
    });
  }
}
