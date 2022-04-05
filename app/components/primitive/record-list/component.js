import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
export default class VaultContentComponent extends Component {
  @service router;
  @tracked showEmptyStateButton =
    (this.args.onIfEmptyButtonClick && this.args.ifEmpty?.actionText) ?? false;

  @action
  handleClick(record) {
    if (this.args.onRecordClick) {
      this.args.onRecordClick(record);
    }
  }

  @action
  handleIfEmptyClick() {
    if (this.showEmptyStateButton) {
      this.args.onIfEmptyButtonClick();
    }
  }
}
