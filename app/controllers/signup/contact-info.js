import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
import breadcrumbs from 'houseninja/utils/signup/breadcrumbs';

export default class SignupContactInfoController extends Controller {
  breadcrumbs = breadcrumbs.signUp;

  @service current;
  @service router;

  @tracked firstName;
  @tracked lastName;
  @tracked phoneNumber;
  @tracked email;

  contactFields = [
    {
      id: 'first-name',
      required: true,
      label: 'First Name',
      placeholder: '',
      value: this.firstName,
    },
    {
      id: 'last-name',
      required: true,
      label: 'Last Name',
      placeholder: '',
      value: this.lastName,
    },
    {
      type: 'tel',
      id: 'phone',
      required: true,
      label: 'Phone',
      placeholder: '',
      description: 'We only use your phone number to contact you.',
      value: this.phoneNumber,
    },
    {
      type: 'email',
      id: 'email',
      required: true,
      label: 'Email',
      placeholder: '',
      value: this.email,
    },
  ];

  @action
  async saveContactInfo() {
    const contactInfo = {
      firstName: this.firstName,
      lastName: this.lastName,
      phoneNumber: this.phoneNumber,
      email: this.email,
    };
    this.current.signup.contactInfo = contactInfo;
    this.router.transitionTo('signup.payment-method');
  }
}
