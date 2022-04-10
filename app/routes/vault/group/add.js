import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class VaultDocumentGroupAddRoute extends Route {
  @service router;
  @service store;

  model() {
    // return this.store.createRecord('document-group');
  }
}
