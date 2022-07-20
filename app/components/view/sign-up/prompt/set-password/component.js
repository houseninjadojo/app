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
import {
  NATIVE_MOBILE_ROUTE,
  SIGNUP_ROUTE,
} from 'houseninja/data/enums/routes';

export default class SetPasswordComponent extends Component {
  @service current;
  @service router;
  @service onboarding;
  @service store;

  @tracked passwordHasBeenSet = false;
  @tracked requestedToSetUpAccount = false;

  @tracked passwords = {
    password: '',
    passwordConfirmation: '',
  };

  @tracked errors = {
    password: [],
    passwordConfirmation: [],
  };

  @tracked formIsInvalid = true;
  @tracked isLoading = false;

  @tracked requirementsModel = passwordValidation;

  fields = [
    {
      type: 'password',
      id: 'password',
      required: true,
      label: 'New Password',
      placeholder: '',
      value: null,
      rrwebMask: true,
    },
    {
      type: 'password',
      id: 'passwordConfirmation',
      required: true,
      label: 'Confirm Password',
      placeholder: '',
      value: null,
      rrwebMask: true,
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
    this.isLoading = true;
    let user;
    if (isPresent(this.args.user)) {
      user = this.args.user;
      this.requestedToSetUpAccount = true;
    } else {
      user = await this.store.peekAll('user').get('firstObject');
    }
    if (user && !this.formIsInvalid) {
      user.password = this.passwords.password;
      try {
        await user.save();

        if (this.requestedToSetUpAccount) {
          this.passwordHasBeenSet = true;
        } else {
          await this.onboarding.cleanup();
          this.router.transitionTo(SIGNUP_ROUTE.BOOKING_CONFIRMATION);
        }
      } catch (e) {
        this.errors = user.errors;
        debug(e);
        Sentry.captureException(e);
      } finally {
        this.isLoading = false;
      }
    }
  }

  @action
  login() {
    this.router.transitionTo(NATIVE_MOBILE_ROUTE.AUTH.LOGIN);
  }
}
