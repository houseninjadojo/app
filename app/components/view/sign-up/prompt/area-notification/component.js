import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { debug } from '@ember/debug';
import Sentry from 'houseninja/utils/sentry';

export default class AreaNotificationComponent extends Component {
  @service current;
  @service router;
  @service store;

  @tracked email;
  @tracked userSubmittedEmail = false;

  @action
  async saveUserEmail() {
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
      Sentry.captureException(e);
      return false;
    }
  }

  @action
  goBack() {
    this.router.transitionTo('signup.contact-info');
  }
}
