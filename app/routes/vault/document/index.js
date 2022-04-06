import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class VaultDocumentIndexRoute extends Route {
  @service router;
  @service store;

  async model({ doc_id }) {
    const model = await this.store.findRecord('document', doc_id);
    if (model.groupId) {
      let group = await this.store.findRecord('document-group', model.groupId);
      model['groupName'] = group.name;
    }

    return model;
  }
}
