import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class VaultDocumentGroupEditRoute extends Route {
  @service router;
  @service store;

  async model({ group_id }) {
    const model = await this.store.findRecord('document-group', group_id);

    return model;
  }
}
