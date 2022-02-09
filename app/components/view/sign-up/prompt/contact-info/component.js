import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { debug } from '@ember/debug';
import { inputValidation } from 'houseninja/utils/components/input-validation';
import { formatPhoneNumber } from 'houseninja/utils/components/formatting';
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
