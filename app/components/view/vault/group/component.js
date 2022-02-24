import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';

export default class VaultGroupComponent extends Component {
  @service router;

  get getEmptyMessage() {
    return {
      message: 'You have no ' + this.args.model.name + ' documents.',
      action: 'Upload Document',
    };
  }

  @action
  selectRoute(route) {
    if (route === 'vault') {
      // transition back
      this.router.transitionTo(route);
    }
    if (route === 'vault.group.edit') {
      // edit group
      console.log(route);
      console.log(this.args.model);
      this.router.transitionTo(route, this.args.model.id);
    }
    if (typeof route === 'object') {
      if (route.type !== 'group') {
        // view file
        console.log(route);
        this.router.transitionTo(`vault.document`, route.id);
      }
    }
  }
}
