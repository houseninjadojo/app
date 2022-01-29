import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
import breadcrumbs from 'houseninja/utils/signup/breadcrumbs';
import * as Sentry from '@sentry/ember';

export default class SignupSetPasswordController extends Controller {
  breadcrumbs = breadcrumbs.password;

  @service current;
  @service router;
  @service store;

  @tracked password;
  @tracked passwordConfirmation;

  securityFields = [
    {
      id: 'new-password',
      required: true,
      label: 'New Password',
      placeholder: '',
      value: this.password,
    },
    {
      id: 'confirm-password',
      required: true,
      label: 'Confirm Password',
      placeholder: '',
      value: this.passwordConfirmation,
    },
  ];

  @action
  async savePassword() {
    let user = this.current.user;
    if (this.password === this.passwordConfirmation) {
      user.password = this.password;
      try {
        await user.save();
        this.router.transitionTo('signup.welcome');
      } catch (e) {
        Sentry.captureException(e);
      }
    }
  }

  @action
  goBack() {
    this.router.transitionTo('signup.payment-method');
  }
}
