import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { captureException } from 'houseninja/utils/sentry';
import { inputValidation } from 'houseninja/utils/components/input-validation';
import { formatPhoneNumber } from 'houseninja/utils/components/formatting';

export default class SettingsContactController extends Controller {
  @service intercom;
  @service router;
  @service view;

  @tracked formIsInvalid = true;
  @tracked contactInfo = {
    firstName: this.model.firstName,
    lastName: this.model.lastName,
    phoneNumber: this.model.phoneNumber,
    email: this.model.email,
  };
  @tracked fields = [
    {
      id: 'firstName',
      required: true,
      label: 'First Name',
      placeholder: '',
      value: this.model.firstName,
      // disabled: true,
    },
    {
      id: 'lastName',
      required: true,
      label: 'Last Name',
      placeholder: '',
      value: this.model.lastName,
      // disabled: true,
    },
    {
      type: 'tel',
      id: 'phoneNumber',
      required: true,
      label: 'Phone',
      placeholder: '',
      value: this.model.phoneNumber,
      disabled: true,
    },
    {
      type: 'email',
      id: 'email',
      required: true,
      label: 'Email',
      placeholder: '',
      value: this.model.email,
      disabled: true,
    },
  ];

  @action
  resetForm() {
    this.contactInfo.firstName = this.model.firstName;
    this.contactInfo.lastName = this.model.lastName;
    this.contactInfo.phoneNumber = this.model.phoneNumber;
    this.contactInfo.email = this.model.email;
    this.formIsInvalid = true;
  }

  @action
  async saveAction() {
    this.model?.setProperties(this.contactInfo);
    if (this.model?.hasDirtyAttributes) {
      try {
        await this.model.save();
        await this.resetForm();
        this.view.transitionToPreviousRoute();
      } catch (e) {
        captureException(e);
      }
    }
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
      // TODO: commenting out phoneIsValid for now
      // spending too much time trying to optimize
      // 'phoneIsValid',
      'emailIsValid',
    ]).isInvalid;
  }

  @action
  openChatModal() {
    this.intercom.showComposer(
      'I need to make a change to my account information.'
    );
  }
}
