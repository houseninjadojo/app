import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class SettingsSecurityController extends Controller {
  @service router;

  @action
  async saveAction() {
    if (this.model.hasDirtyAttributes) {
      await this.model.save();
      this.router.transitionTo('settings.index');
    }
  }
}
