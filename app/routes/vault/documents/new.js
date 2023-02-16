import Route from '@ember/routing/route';
import { instrumentRoutePerformance } from '@sentry/ember';
import { service } from '@ember/service';
import RSVP from 'rsvp';

class VaultDocumentsNewRoute extends Route {
  @service router;
  @service store;

  groups = [];

  model() {
    return RSVP.hash({
      groups: this.store.findAll('document-group'),
      document: this.store.createRecord('document'),
      media: null,
    });
  }
}

export default instrumentRoutePerformance(VaultDocumentsNewRoute);
