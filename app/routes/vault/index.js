import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { getIconUri } from 'houseninja/utils/components/formatting';
import { vault } from 'houseninja/utils/dataStubs';

export default class VaultGroupIndexRoute extends Route {
  @service router;

  documents = vault.documentStub.map((d) => {
    return {
      ...d,
      iconUri: getIconUri(d.type),
    };
  });

  groups = vault.groupStub.map((g) => {
    return {
      ...g,
      iconUri: getIconUri(g.type),
    };
  });

  model() {
    const model = {
      groups: this.groups,
      documents: this.documents.filter((d) => !d.groupId),
    };
    return model;
  }
}
