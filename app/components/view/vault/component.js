import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';

export default class VaultContentComponent extends Component {
  @service router;

  @action
  selectRoute(route) {
    if (route === 'vault.group.new') {
      this.router.transitionTo(route);
    }
    if (route === 'vault.upload') {
      this.router.transitionTo(route);
    }
    if (typeof route === 'object') {
      if (route.type === 'group') {
        this.router.transitionTo(`vault.group`, route.id);
      } else {
        this.router.transitionTo();
      }
      if (route.type !== 'group') {
        // view file
        this.router.transitionTo(`vault.document`, route.id);
      }
    }
  }
}
