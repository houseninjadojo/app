import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { Browser } from '@capacitor/browser';
import ENV from 'houseninja/config/environment';
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

    //isImage
    if (true) {
      Browser.open({
        windowName: model.name || model.uri,
        // url: model.uri,
        url: `${ENV.appHost}/${model.uri}`,
        presentationStyle: 'popover',
      });
    }

    return model;
  }
}
