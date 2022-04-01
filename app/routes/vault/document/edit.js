import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class VaultDocumentEditRoute extends Route {
  @service router;
  @service store;

  groups = [];

  async beforeModel() {
    const groups = await this.store.findAll('document-group');
    this.groups = groups.map((g) => {
      const { id, name, description } = g;
      return {
        id,
        name,
        description,
        ...g,
      };
    });
  }

  async model({ doc_id }) {
    const document = await this.store.findRecord('document', doc_id);
    console.log(document.url);
    const model = {
      groups: this.groups,
      document,
      media: null,
    };
    return model;
  }
}
