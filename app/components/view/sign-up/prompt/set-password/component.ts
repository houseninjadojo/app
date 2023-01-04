import Component from '@glimmer/component';
import { tracked } from 'tracked-built-ins';
import { action } from '@ember/object';
import { service } from '@ember/service';
import {
  inputValidation,
  passwordValidation,
} from 'houseninja/utils/components/input-validation';
import { isPresent } from '@ember/utils';
import {
  NATIVE_MOBILE_ROUTE,
  SIGNUP_ROUTE,
} from 'houseninja/data/enums/routes';
import CurrentService from 'houseninja/services/current';
import TelemetryService from 'houseninja/services/telemetry';
import RouterService from '@ember/routing/router-service';
import OnboardingService from 'houseninja/services/onboarding';
import StoreService from 'houseninja/services/store';
import User from 'houseninja/models/user';
import { Field } from 'houseninja';

type Args = {
  user: User;
};

type PasswordValidation =
  | ReturnType<typeof passwordValidation>
  | typeof passwordValidation;

export default class SetPasswordComponent extends Component<Args> {
  @service declare current: CurrentService;
  @service declare router: RouterService;
  @service declare onboarding: OnboardingService;
  @service declare store: StoreService;
  @service declare telemetry: TelemetryService;

  @tracked passwordHasBeenSet = false;

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

  @tracked requirementsModel: PasswordValidation = passwordValidation;

  fields: Field[] = [
    {
      type: 'password',
      id: 'password',
      required: true,
      label: 'New Password',
      placeholder: '',
      value: undefined,
    },
    {
      type: 'password',
      id: 'passwordConfirmation',
      required: true,
      label: 'Confirm Password',
      placeholder: '',
      value: undefined,
    },
  ];

  constructor(owner: unknown, args: Args) {
    super(owner, args);

    if (isPresent(this.args.user)) {
      this.passwords.password = this.args.user.password ?? '';
      this.passwords.passwordConfirmation = this.args.user.password ?? '';
      this.formIsInvalid = false;
    }
  }

  __isOnboarding(): boolean {
    const ONBOARDING_PARAM = 'code';
    return isPresent(this.router.currentRoute.queryParams[ONBOARDING_PARAM]);
  }

  @action
  validateForm(e: InputEvent): void {
    const target = e.target as HTMLInputElement;
    const targetId = target.id as keyof typeof this.passwords;
    const field = this.fields.find((f) => f.id === targetId);
    this.passwords[targetId] = target.value;
    if (field) {
      field.value = this.passwords[targetId];
    }

    this.requirementsModel = passwordValidation(this.fields);
    this.formIsInvalid = inputValidation(this.fields, [
      'passwordIsValid',
    ]).isInvalid;
  }

  @action
  async savePassword(): Promise<void> {
    this.isLoading = true;
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
        await this.onboarding.cleanup();

        if (this.__isOnboarding()) {
          this.passwordHasBeenSet = true;
        } else {
          this.router.transitionTo(SIGNUP_ROUTE.BOOKING_CONFIRMATION);
        }
      } catch (e) {
        this.errors = user.errors;
        this.telemetry.captureException(e as Error);
      } finally {
        this.isLoading = false;
      }
    }
  }

  @action
  login(): void {
    this.router.transitionTo(NATIVE_MOBILE_ROUTE.AUTH.LOGIN);
  }
}
