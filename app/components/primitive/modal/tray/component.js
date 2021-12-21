import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class TrayComponent extends Component {
  @service router;

  @action
  goBack() {
    this.router.transitionTo(this.args.backRoute);
  }
}
