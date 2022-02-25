import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';

export default class VaultContentComponent extends Component {
  @service router;

  @action
  handleClick(record) {
    if (this.args.onRecordClick) {
      this.args.onRecordClick(record);
    }
  }
}
