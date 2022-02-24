import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';

export default class VaultContentComponent extends Component {
  @service router;

  @action
  selectRoute(routeName) {
    this.router.transitionTo(routeName);
  }
}
