import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class ModalDialogComponent extends Component {
  @action
  toggleModal() {
    if (!this.args.disableClose) {
      this.args.toggleModal && this.args.toggleModal();
    }
  }
}
