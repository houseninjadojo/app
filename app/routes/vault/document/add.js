import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class VaultDocumentAddRoute extends Route {
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

  model() {
    const model = {
      groups: this.groups,
      document: {},
      media: null,
    };
    return model;
  }
}
