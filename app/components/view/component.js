import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
export default class ViewComponent extends Component {
  @service router;
  @service view;

  @action
  applyPreservedScrollPosition() {
    this.view.applyPreservedScrollPosition(this.router);
  }
}
