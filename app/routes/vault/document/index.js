import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { vault } from 'houseninja/utils/dataStubs';

export default class VaultDocumentIndexRoute extends Route {
  @service router;

  model(params) {
    const model = vault.documentStub.filter((d) => d.id === params.doc_id)[0];
    const group = vault.groupStub.filter((g) => {
      return g.id === model.groupId;
    })[0];

    if (group) {
      model['groupName'] = group.name;
    }

    return model;
  }
}
