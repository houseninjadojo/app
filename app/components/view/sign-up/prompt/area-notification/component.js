import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { debug } from '@ember/debug';
import { captureException } from 'houseninja/utils/sentry';

export default class AreaNotificationComponent extends Component {
  @service current;
  @service router;
  @service store;

  @tracked email;
  @tracked userSubmittedEmail = false;
  @tracked isLoading = false;

  @action
  async saveUserEmail() {
    this.isLoading = true;
    let zipcode = this.current.signup.zipcode;
    let user = this.store.createRecord('user', {
      email: this.email,
      requestedZipcode: zipcode,
    });
    try {
      await user.save();
      this.userSubmittedEmail = true;
      return;
    } catch (e) {
      debug(e);
      captureException(e);
      return false;
    } finally {
      this.isLoading = false;
    }
  }
}
