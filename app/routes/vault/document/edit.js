import Route from '@ember/routing/route';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { isPresent } from '@ember/utils';
import RSVP from 'rsvp';

export default class VaultDocumentEditRoute extends Route {
  @service router;
  @service store;

  groups = [];

  model({ doc_id }) {
    return RSVP.hash({
      groups: this.store.findAll('document-group'),
      document: this.store.findRecord('document', doc_id),
      media: null,
    });
  }

  @action
  error(error, transition) {
    if (isPresent(error.errors.findBy('status', '404'))) {
      transition.abort();
      this.router.transitionTo('vault.index');
    }
  }
}
