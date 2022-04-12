import Route from '@ember/routing/route';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { isPresent } from '@ember/utils';

export default class VaultDocumentIndexRoute extends Route {
  @service router;
  @service store;

  async model({ doc_id }) {
    return await this.store.findRecord('document', doc_id, {
      include: 'document_group',
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
