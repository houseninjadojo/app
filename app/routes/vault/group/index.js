import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class VaultGroupIndexRoute extends Route {
  @service router;
  @service store;

  documents = [];

  async model({ group_id }) {
    return await this.store.findRecord('document-group', group_id, {
      include: 'documents',
    });
  }
}
