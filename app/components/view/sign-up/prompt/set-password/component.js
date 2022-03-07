import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { debug } from '@ember/debug';
import {
  inputValidation,
  passwordValidation,
} from 'houseninja/utils/components/input-validation';
import Sentry from 'houseninja/utils/sentry';
import { isPresent } from '@ember/utils';

export default class SetPasswordComponent extends Component {
  @service current;
  @service router;
  @service store;

  @tracked passwords = {
    password: '',
    passwordConfirmation: '',
  };

  @tracked errors = {
    password: [],
    passwordConfirmation: [],
  };

  @tracked formIsInvalid = true;

  @tracked requirementsModel = passwordValidation;

  fields = [
    {
      type: 'password',
      id: 'password',
      required: true,
      label: 'New Password',
      placeholder: '',
      value: null,
    },
    {
      type: 'password',
      id: 'passwordConfirmation',
      required: true,
      label: 'Confirm Password',
      placeholder: '',
      value: null,
    },
  ];

  constructor() {
    super(...arguments);

    if (isPresent(this.args.user)) {
      this.passwords.password = this.args.user.password;
      this.passwords.passwordConfirmation = this.args.user.password;
      this.formIsInvalid = false;
    }
  }

  @action
  validateForm(e) {
    this.passwords[e.target.id] = e.target.value;
    this.fields.filter((f) => f.id === e.target.id)[0].value =
      this.passwords[e.target.id];

    this.requirementsModel = passwordValidation(this.fields);
    this.formIsInvalid = inputValidation(this.fields, [
      'passwordIsValid',
    ]).isInvalid;
  }

  @action
  async savePassword() {
    let user;
    if (isPresent(this.args.user)) {
      user = this.args.user;
    } else {
      user = await this.store.peekAll('user').get('firstObject');
    }
    if (user && !this.formIsInvalid) {
      user.password = this.passwords.password;
      try {
        await user.save();
        this.router.transitionTo('signup.booking-confirmation');
      } catch (e) {
        this.errors = user.errors;
        debug(e);
        Sentry.captureException(e);
      }
    }
  }
}
