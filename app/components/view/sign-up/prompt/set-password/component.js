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
    password: '',
    passwordConfirmation: '',
  };

  @tracked formIsInvalid = true;

  @tracked requirementsModel;

  fields = [
    {
      type: 'password',
      id: 'password',
      required: true,
      label: 'New Password',
      placeholder: '',
      value: 'password',
    },
    {
      type: 'password',
      id: 'passwordConfirmation',
      required: true,
      label: 'Confirm Password',
      placeholder: '',
      value: 'passwordConfirmation',
    },
  ];

  @action
  validatePasswordRequirement(e) {
    this.passwords[e.target.id] = e.target.value;

    this.requirementsModel = {
      passwordsMatch:
        this.passwords.password &&
        this.passwords.password === this.passwords.passwordConfirmation,
      atLeastThisLong: this.passwords.password.length >= 12,
      hasLowercase: /[a-z]/.test(this.passwords.password),
      hasUppercase: /[A-Z]/.test(this.passwords.password),
      hasNumber: /\d/.test(this.passwords.password),
      hasSymbol: /[!$&.#@]/.test(this.passwords.password),
    };

    const allRequirementsMet =
      Object.values(this.requirementsModel).indexOf(false) === -1;

    if (allRequirementsMet) {
      this.formIsInvalid = false;
    } else {
      this.formIsInvalid = true;
    }
  }

  @action
  async savePassword() {
    let user = this.current.user;
    if (!this.formIsInvalid) {
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
}
