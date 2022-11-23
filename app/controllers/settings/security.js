import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { captureException } from 'houseninja/utils/sentry';

export default class SettingsSecurityController extends Controller {
  @service router;
  @service view;

  @tracked passwords = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  @tracked formIsInvalid = true;

  @tracked requirementsModel;

  @action
  validatePasswordRequirement(e) {
    this.passwords[e.target.id] = e.target.value;

    this.requirementsModel = {
      currentPasswordIsNotEmpty: this.passwords.currentPassword.length > 0,
      passwordsMatch:
        this.passwords.newPassword &&
        this.passwords.newPassword === this.passwords.confirmPassword,
      atLeastThisLong: this.passwords.newPassword.length >= 8,
      hasLowercase: /[a-z]/.test(this.passwords.newPassword),
      hasUppercase: /[A-Z]/.test(this.passwords.newPassword),
      hasNumber: /\d/.test(this.passwords.newPassword),
      hasSymbol: /[!$&.#@]/.test(this.passwords.newPassword),
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
  async reset() {
    this.requirementsModel = null;
    this.passwords.currentPassword = null;
    this.passwords.newPassword = null;
    this.passwords.confirmPassword = null;
    this.formIsInvalid = true;
  }

  @action
  async saveAction() {
    if (!this.formIsInvalid && this.model && this.model.hasDirtyAttributes) {
      try {
        await this.model.save();
        await this.resetForm();
        await this.model.reload();
        this.view.transitionToPreviousRoute();
      } catch (e) {
        captureException(e);
      }
    }
  }
}
