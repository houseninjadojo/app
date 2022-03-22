import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { getIconUri } from 'houseninja/utils/components/formatting';
import { vault } from 'houseninja/data/document-stub';

export default class VaultGroupIndexRoute extends Route {
  @service router;

  documents = vault.documentStub.map((d) => {
    return {
      ...d,
      iconUri: getIconUri(d.type),
    };
  });

  model(params) {
    const model = vault.groupStub.filter((g) => g.id === params.group_id)[0];
    model['documents'] = this.documents.filter((d) => {
      return d.groupId === params.group_id;
    });

    return model;
  }
}
