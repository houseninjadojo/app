import Route from '@ember/routing/route';
import { service } from '@ember/service';
import RSVP from 'rsvp';

export default class VaultDocumentAddRoute extends Route {
  @service router;
  @service store;

  groups = [];

  model() {
    return RSVP.hash({
      groups: this.store.findAll('document-group'),
      document: {},
      media: null,
    });
  }
}
