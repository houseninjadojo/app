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

  fields = [
    {
      id: 'first-name',
      required: true,
      label: 'First Name',
      placeholder: '',
      value: 'firstName',
    },
    {
      id: 'last-name',
      required: true,
      label: 'Last Name',
      placeholder: '',
      value: 'lastName',
    },
    {
      type: 'tel',
      id: 'phone',
      required: true,
      label: 'Phone',
      placeholder: '',
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
}
