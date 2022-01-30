import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { debug } from '@ember/debug';
import * as Sentry from '@sentry/ember';

export default class SettingsSecurityController extends Controller {
  @service router;

  @action
  async saveAction() {
    if (this.model.hasDirtyAttributes) {
      try {
        await this.model.save();
        await this.model.reload(); // clear password if changed
        this.router.transitionTo('settings.index');
      } catch (e) {
        debug(e);
        Sentry.captureException(e);
      }
    }
  }
}
