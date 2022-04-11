import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class VaultDocumentIndexRoute extends Route {
  @service router;
  @service store;

  async model({ doc_id }) {
    return await this.store.findRecord('document', doc_id, {
      include: 'document_group',
    });
  }
}
