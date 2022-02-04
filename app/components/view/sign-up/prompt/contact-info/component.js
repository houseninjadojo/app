import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { debug } from '@ember/debug';
import * as Sentry from '@sentry/ember';

export default class ContactInfoComponent extends Component {
  @service current;
  @service router;
  @service store;

  @tracked contactInfo = {
    firstName: null,
    lastName: null,
    phoneNumber: null,
    email: null,
  };

  @tracked formIsInvalid = true;

  fields = [
    {
      id: 'firstName',
      required: true,
      label: 'First Name',
      placeholder: '',
      value: 'firstName',
    },
    {
      id: 'lastName',
      required: true,
      label: 'Last Name',
      placeholder: '',
      value: 'lastName',
    },
    {
      type: 'tel',
      id: 'phoneNumber',
      required: true,
      label: 'Phone',
      placeholder: 'XXX-XXX-XXXX',
      description: 'We only use your phone number to contact you.',
      value: 'phoneNumber',
    },
    {
      type: 'email',
      id: 'email',
      required: true,
      label: 'Email',
      placeholder: '',
      value: 'email',
    },
  ];

  @action
  async saveContactInfo() {
    let user = this.store.createRecord('user', {
      ...this.contactInfo,
    });
    try {
      await user.save();
      this.router.transitionTo('signup.payment-method');
    } catch (e) {
      debug(e);
      Sentry.captureException(e);
    }
  }

  @action
  goBack() {
    this.router.transitionTo('signup.contact-info');
  }

  @action
  validateForm(e) {
    this.contactInfo[e.target.id] = e.target.value;
    const EMAIL_REGGIE =
      /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
    const PHONE_REGGIE = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
    this.requirementsModel = {
      noEmptyFields: Object.values(this.contactInfo).indexOf(false) === -1,
      emailIsValid: EMAIL_REGGIE.test(this.contactInfo.email),
      validPhonePattern: PHONE_REGGIE.test(this.contactInfo.phoneNumber),
    };

    const allRequirementsMet =
      Object.values(this.requirementsModel).indexOf(false) === -1;

    if (allRequirementsMet) {
      this.formIsInvalid = false;
    } else {
      this.formIsInvalid = true;
    }
  }
}
