import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';

export default class TrayComponent extends Component {
  @service router;

  @action
  goBack() {
    this.router.transitionTo(this.args.backRoute);
    if (this.args.onBack) {
      this.args.onBack();
    }
  }

  @action
  async callSaveAction() {
    if (this.args.saveAction) {
      await this.args.saveAction();
    }
  }
}
