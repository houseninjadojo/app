import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { getIconUri } from 'houseninja/utils/components/formatting';

export default class VaultIndexRoute extends Route {
  @service router;
  @service store;

  groups = [];
  documents = [];

  async model() {
    const groups = await this.store.findAll('document-group');
    const documents = await this.store.findAll('document');

    this.groups = groups;
    // this.groups = groups.map((g) => {
    //   const { id, type, name, description } = g;
    //   return {
    //     id,
    //     type,
    //     name,
    //     description,
    //     iconUri: getIconUri('folder'),
    //   };
    // });

    this.documents = documents
      .filter((d) => !d.groupId)
      .map((d) => {
        const { id, contentType, name, description /* , url, groupId  */ } = d;
        return {
          id,
          contentType,
          name,
          description,
          // url,
          // groupId,
          iconUri: getIconUri(d.contentType),
          ...d,
        };
      });
    console.log(this.documents);
    const model = {
      groups: this.groups,
      documents: this.documents,
    };
    return model;
  }
}
