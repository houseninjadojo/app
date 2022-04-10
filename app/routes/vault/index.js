import Route from '@ember/routing/route';
import { service } from '@ember/service';
import RSVP from 'rsvp';

export default class VaultIndexRoute extends Route {
  @service router;
  @service store;

  groups = [];
  documents = [];

  model() {
    return RSVP.hash({
      groups: this.store.findAll('document-group'),
      documents: this.store.findAll('document'),
    });
  }
}
