import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class VaultGroupsNewRoute extends Route {
  @service router;
  @service store;

  model() {
    // return this.store.createRecord('document-group');
  }
}
