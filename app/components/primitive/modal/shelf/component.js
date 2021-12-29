import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';

export default class ShelfComponent extends Component {
  @service router;

  @action
  goBack() {
    this.router.transitionTo(this.args.backRoute);
  }
}
