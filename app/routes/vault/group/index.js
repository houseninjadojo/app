import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { getIconUri } from 'houseninja/utils/components/formatting';

export default class VaultGroupIndexRoute extends Route {
  @service router;
  @service store;

  documents = [];

  async model({ group_id }) {
    const documents = await this.store.findAll('document');

    this.documents = documents
      .filter((d) => d.groupId === group_id)
      .map((d) => {
        const { id, type, name, description, url, groupId } = d;
        return {
          id,
          type,
          name,
          description,
          url,
          groupId,
          iconUri: getIconUri(d.type),
          ...d,
        };
      });

    const model = await this.store.findRecord('document-group', group_id);
    model['documents'] = this.documents;

    return model;
  }
}
