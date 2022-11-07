import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { inputValidation } from 'houseninja/utils/components/input-validation';
import { formatPhoneNumber } from 'houseninja/utils/components/formatting';
import { captureException } from 'houseninja/utils/sentry';
import { isPresent, isEmpty } from '@ember/utils';
import {
  PAYMENT_METHOD,
  CONTACT_INFO,
  ACCOUNT_SETUP,
} from 'houseninja/data/enums/onboarding-step';
import { SIGNUP_ROUTE } from 'houseninja/data/enums/routes';
import { TrackedArray, TrackedObject } from 'tracked-built-ins';

import type CurrentService from 'houseninja/services/current';
import type RouterService from '@ember/routing/router-service';
import type OnboardingService from 'houseninja/services/onboarding';
import type StoreService from 'houseninja/services/store';
import type User from 'houseninja/models/user';
import type { Field } from 'houseninja/app/components';

type Args = {
  isOnboardingViaNativeApp: boolean;
  user: User;
  toggleModal?: () => void;
};

type ContactInfo = {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  email?: string;
};

export default class ContactInfoComponent extends Component<Args> {
  @service declare current: CurrentService;
  @service declare router: RouterService;
  @service declare onboarding: OnboardingService;
  @service declare store: StoreService;

  @tracked errors = new TrackedObject({
    firstName: [],
    lastName: [],
    phoneNumber: [],
    email: [],
  });

  contactInfo: ContactInfo = new TrackedObject({
    firstName: undefined,
    lastName: undefined,
    phoneNumber: undefined,
    email: undefined,
  });

  @tracked formIsInvalid = true;
  @tracked isLoading = false;

  signupFields: Field[] = [
    {
      id: 'firstName',
      required: true,
      label: 'First Name',
      placeholder: '',
      value: undefined,
    },
    {
      id: 'lastName',
      required: true,
      label: 'Last Name',
      placeholder: '',
      value: undefined,
    },
    {
      type: 'tel',
      id: 'phoneNumber',
      required: true,
      label: 'Phone',
      value: undefined,
    },
  ];

  howDidYouHearAboutUsLabel = 'howDidYouHearAboutUs';

  fields: Field[] = new TrackedArray([
    ...(!this.args.isOnboardingViaNativeApp ? this.signupFields : []),
    {
      type: 'email',
      id: 'email',
      required: true,
      label: 'Email',
      placeholder: '',
      value: undefined,
    },
    ...(!this.args.isOnboardingViaNativeApp
      ? [
          {
            id: this.howDidYouHearAboutUsLabel,
            required: false,
            hideLabel: true,
            value: undefined,
            placeholder: '(Optional)',
          },
        ]
      : []),
  ]);

  constructor(owner: unknown, args: Args) {
    super(owner, args);

    if (isPresent(this.args.user)) {
      this.contactInfo.firstName = this.args.user.firstName;
      this.contactInfo.lastName = this.args.user.lastName;
      this.contactInfo.phoneNumber = this.args.user.phoneNumber;
      this.contactInfo.email = this.args.user.email;
      this.formIsInvalid = false;
    }
  }

  @action
  async onboardUser(user: User): Promise<void> {
    this.onboarding.rehydrateFromRemote.perform();
    let route = this.onboarding.routeFromStep(user.onboardingStep);
    if (user.onboardingStep === CONTACT_INFO) {
      route = SIGNUP_ROUTE.PAYMENT_METHOD;
    }
    this.router.transitionTo(route);
  }

  @action
  async saveContactInfo(): Promise<User | undefined> {
    this.isLoading = true;
    // get rid of anything in memory
    if (isPresent(this.args.user)) {
      this.args.user.unloadRecord();
    }
    // get the onboarding step
    const onboardingStep = this.args.isOnboardingViaNativeApp
      ? ACCOUNT_SETUP
      : PAYMENT_METHOD;
    // commit to memory
    const user = this.store.createRecord('user', {
      ...this.contactInfo,
      onboardingStep,
    });
    try {
      await user.save(); // save to the server
    } catch (e) {
      this.errors = user.errors;
      captureException(e as Error);
      return;
    } finally {
      this.isLoading = false;
    }
    return user;
  }

  @action
  async handlePrimaryClick(): Promise<void> {
    const user = await this.saveContactInfo();
    if (isEmpty(user)) {
      return;
    } else if (this.args.isOnboardingViaNativeApp) {
      this.args.toggleModal && this.args.toggleModal();
      return;
    } else if (user.shouldResumeOnboarding) {
      this.onboardUser(user);
    } else {
      this.router.transitionTo(SIGNUP_ROUTE.PAYMENT_METHOD);
    }
  }

  @action
  goBack(): void {
    this.router.transitionTo(SIGNUP_ROUTE.INDEX);
  }

  @action
  validateForm(e: InputEvent): void {
    const target = e.target as HTMLInputElement;
    const targetId = target.id as keyof ContactInfo;
    const field = this.fields.find((f) => f.id === targetId);
    if (targetId === 'phoneNumber') {
      target.value = target.value.replace(/\D/g, '');
      formatPhoneNumber(target);
      this.contactInfo.phoneNumber = target.value;
      if (field) field.value = target.value;
    } else {
      this.contactInfo[targetId] = target.value;
      if (field) this.contactInfo[targetId];
    }
    this.formIsInvalid = inputValidation(this.fields, [
      ...(!this.args.isOnboardingViaNativeApp ? ['phoneIsValid'] : []),
      'emailIsValid',
    ]).isInvalid;
  }
}
