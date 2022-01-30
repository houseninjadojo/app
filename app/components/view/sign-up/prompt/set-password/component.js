import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { debug } from '@ember/debug';
import * as Sentry from '@sentry/ember';

export default class SetPasswordComponent extends Component {
  @service current;
  @service router;
  @service store;

  @tracked passwords = {
    password: null,
    passwordConfirmation: null,
  };

  fields = [
    {
      id: 'new-password',
      required: true,
      label: 'New Password',
      placeholder: '',
      value: 'password',
    },
    {
      id: 'confirm-password',
      required: true,
      label: 'Confirm Password',
      placeholder: '',
      value: 'passwordConfirmation',
    },
  ];

  @action
  async savePassword() {
    let user = this.current.user;
    if (this.passwordsMatch()) {
      user.password = this.passwords.password;
      try {
        await user.save();
        await user.reload(); // clear the password
        this.router.transitionTo('signup.welcome');
      } catch (e) {
        debug(e);
        Sentry.captureException(e);
      }
    }
  }

  @action
  goBack() {
    this.router.transitionTo('signup.payment-method');
  }

  get passwordsMatch() {
    let { password, passwordConfirmation } = this.password;
    return password === passwordConfirmation;
  }
}
