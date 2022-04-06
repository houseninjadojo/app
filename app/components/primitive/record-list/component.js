import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
export default class RecordListComponent extends Component {
  @service loader;
  @service router;

  @tracked showEmptyStateButton =
    (this.args.onIfEmptyButtonClick && this.args.ifEmpty?.actionText) ?? false;

  width = 1000;
  height = 100;

  get isLoading() {
    return this.loader.isLoading;
  }

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
