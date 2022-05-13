import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class ModalDialogComponent extends Component {
  @action
  toggleModal() {
    this.args.toggleModal && this.args.toggleModal();
  }
}
