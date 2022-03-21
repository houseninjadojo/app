import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';

export default class ShelfComponent extends Component {
  @service router;
  @service view;

  @action
  goBack() {
    this.view.transitionToPreviousRoute();
  }
}
