import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';

export default class VaultGroupComponent extends Component {
  @service router;
  @service haptics;

  get getEmptyMessage() {
    return {
      message: 'You have no ' + this.args.model.name + ' documents.',
      action: 'Upload Document',
    };
  }

  @action
  selectRoute(route) {
    this.haptics.giveFeedback();

    if (route === 'vault') {
      // transition back
      this.router.transitionTo(route);
    }
    if (route === 'vault.group.edit') {
      // edit group
      this.router.transitionTo(route, this.args.model.id);
    }
    if (typeof route === 'object') {
      if (route.type !== 'group') {
        // view file
        this.router.transitionTo(`vault.document`, route.id);
      }
    }
  }
}
