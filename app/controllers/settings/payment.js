import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { debug } from '@ember/debug';
import Sentry from 'houseninja/utils/sentry';

export default class SettingsPaymentController extends Controller {
  @service router;

  @action
  async saveAction() {
    if (this.model.hasDirtyAttributes) {
      try {
        await this.model.save();
        this.router.transitionTo('settings.index');
      } catch (e) {
        debug(e);
        Sentry.captureException(e);
      }
    }
  }
}
