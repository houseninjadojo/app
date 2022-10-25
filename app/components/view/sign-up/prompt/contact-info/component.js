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

export default class ContactInfoComponent extends Component {
  @service current;
  @service router;
  @service onboarding;
  @service store;

  @tracked errors = {
    firstName: [],
    lastName: [],
    phoneNumber: [],
    email: [],
  };

  @tracked contactInfo = {
    firstName: null,
    lastName: null,
    phoneNumber: null,
    email: null,
  };

  @tracked formIsInvalid = true;
  @tracked isLoading = false;

  signupFields = [
    {
      id: 'firstName',
      required: true,
      label: 'First Name',
      placeholder: '',
      value: null,
    },
    {
      id: 'lastName',
      required: true,
      label: 'Last Name',
      placeholder: '',
      value: null,
    },
    {
      type: 'tel',
      id: 'phoneNumber',
      required: true,
      label: 'Phone',
      value: null,
    },
  ];

  howDidYouHearAboutUsLabel = 'howDidYouHearAboutUs';

  @tracked fields = [
    ...(!this.args.isOnboardingViaNativeApp ? this.signupFields : []),
    {
      type: 'email',
      id: 'email',
      required: true,
      label: 'Email',
      placeholder: '',
      value: null,
    },
    ...(!this.args.isOnboardingViaNativeApp
      ? [
          {
            id: this.howDidYouHearAboutUsLabel,
            required: false,
            hideLabel: true,
            value: null,
            placeholder: '(Optional)',
          },
        ]
      : []),
  ];

  constructor() {
    super(...arguments);

    if (isPresent(this.args.user)) {
      this.contactInfo = this.args.user.getProperties(
        'email',
        'phoneNumber',
        'firstName',
        'lastName'
      );
      this.formIsInvalid = false;
    }
  }

  @action
  async onboardUser(user) {
    this.onboarding.rehydrateFromRemote.perform();
    let route = this.onboarding.routeFromStep(user.onboardingStep);
    if (user.onboardingStep === CONTACT_INFO) {
      route = SIGNUP_ROUTE.PAYMENT_METHOD;
    }
    this.router.transitionTo(route);
  }

  @action
  async saveContactInfo() {
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
      // save to the server
      await user.save();
    } catch (e) {
      this.errors = user.errors;
      captureException(e);
      return;
    } finally {
      this.isLoading = false;
    }
    return user;
  }

  @action
  async handlePrimaryClick() {
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
  goBack() {
    this.router.transitionTo(SIGNUP_ROUTE.INDEX);
  }

  @action
  validateForm(e) {
    if (e.target.id === 'phoneNumber') {
      this.contactInfo[e.target.id] = e.target.value.replace(/\D/g, '');
      formatPhoneNumber(e.target);
      this.fields.filter((f) => f.id === e.target.id)[0].value = e.target.value;
    } else {
      this.contactInfo[e.target.id] = e.target.value;
      this.fields.filter((f) => f.id === e.target.id)[0].value =
        this.contactInfo[e.target.id];
    }

    this.formIsInvalid = inputValidation(this.fields, [
      ...(!this.args.isOnboardingViaNativeApp ? ['phoneIsValid'] : []),
      'emailIsValid',
    ]).isInvalid;
  }
}
