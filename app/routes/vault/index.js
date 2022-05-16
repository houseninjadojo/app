import Route from '@ember/routing/route';
import { service } from '@ember/service';
import RSVP from 'rsvp';
import { NATIVE_MOBILE_ROUTE } from 'houseninja/data/enums/routes';

export default class VaultIndexRoute extends Route {
  @service router;
  @service session;
  @service store;

  groups = [];
  documents = [];

  beforeModel(transition) {
    this.session.requireAuthentication(
      transition,
      NATIVE_MOBILE_ROUTE.AUTH.LOGIN_OR_SIGNUP
    );
  }

  model() {
    return RSVP.hash({
      groups: this.store.findAll('document-group'),
      documents: this.store.query('document', {
        filter: {
          document_group_id: 'uncategorized',
        },
      }),
    });
  }
}
