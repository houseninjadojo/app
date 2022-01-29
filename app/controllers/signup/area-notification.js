import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
import breadcrumbs from 'houseninja/utils/signup/breadcrumbs';
import * as Sentry from '@sentry/ember';

export default class SignupAreaNotificationController extends Controller {
  @service store;
  @service current;

  breadcrumbs = breadcrumbs.serviceaArea;

  @tracked email;

  @action
  async saveUserEmail() {
    let zipcode = this.current.signup.zipcode;
    let user = this.store.createRecord('user', {
      email: this.email,
      requestedZipcode: zipcode,
    });
    try {
      return await user.save();
    } catch (e) {
      Sentry.captureException(e);
      return false;
    }
  }
}
