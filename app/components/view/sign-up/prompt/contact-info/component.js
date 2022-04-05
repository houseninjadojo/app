import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { debug } from '@ember/debug';
import { inputValidation } from 'houseninja/utils/components/input-validation';
import { formatPhoneNumber } from 'houseninja/utils/components/formatting';
import Sentry from 'houseninja/utils/sentry';
import { isPresent } from '@ember/utils';
import { PAYMENT_METHOD } from 'houseninja/data/enums/onboarding-step';

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

  @tracked fields = [
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
      description: 'We only use your phone number to contact you.',
      value: null,
    },
    {
      type: 'email',
      id: 'email',
      required: true,
      label: 'Email',
      placeholder: '',
      value: null,
    },
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
  async saveContactInfo() {
    const user = this.store.createRecord('user', {
      ...this.contactInfo,
      onboardingStep: PAYMENT_METHOD,
    });
    try {
      await user.save();
    } catch (e) {
      this.errors = user.errors;
      debug(e);
      Sentry.captureException(e);
    }
    if (user.shouldResumeOnboarding) {
      this.onboarding.rehydrateFromRemote.perform();
      this.router.transitionTo(
        this.onboarding.routeFromStep(user.onboardingStep)
      );
    } else {
      this.router.transitionTo('signup.payment-method');
    }
  }

  @action
  goBack() {
    this.router.transitionTo('signup.service-area');
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
      'phoneIsValid',
      'emailIsValid',
    ]).isInvalid;
  }
}
