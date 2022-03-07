import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { debug } from '@ember/debug';
import { inputValidation } from 'houseninja/utils/components/input-validation';
import { formatPhoneNumber } from 'houseninja/utils/components/formatting';
import Sentry from 'houseninja/utils/sentry';
import { isPresent } from '@ember/utils';
import { get } from '@ember/object';

export default class ContactInfoComponent extends Component {
  @service current;
  @service router;
  @service store;

  @tracked user = null;

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
      errors: get('user.errors.firstName'),
    },
    {
      id: 'lastName',
      required: true,
      label: 'Last Name',
      placeholder: '',
      value: null,
      errors: get('user.errors.lastName'),
    },
    {
      type: 'tel',
      id: 'phoneNumber',
      required: true,
      label: 'Phone',
      description: 'We only use your phone number to contact you.',
      value: null,
      errors: get('user.errors.phoneNumber'),
    },
    {
      type: 'email',
      id: 'email',
      required: true,
      label: 'Email',
      placeholder: '',
      value: null,
      errors: get('user.errors.email'),
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
      this.user = this.args.user;
    }
  }

  @action
  async saveContactInfo() {
    if (isPresent(this.args.user)) {
      this.user = this.args.user;
      this.user.setProperties(this.contactInfo);
    } else {
      this.user = this.store.createRecord('user', {
        ...this.contactInfo,
      });
    }
    try {
      await this.user.save();
      console.log(this.user.get('errors'));
      console.log(this.user.get('errors.length'));
      console.log(this.user.errors.email);
      console.log(this.user.get('errors.email'));
      console.log(this.user.errors.messages);
      this.router.transitionTo('signup.plan-selection');
    } catch (e) {
      console.log(this.user.get('errors'));
      console.log(this.user.get('errors.length'));
      console.log(this.user.errors.email);
      console.log(this.user.get('errors.email'));
      console.log(this.user.errors.messages);
      debug(e);
      Sentry.captureException(e);
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
