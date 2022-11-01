import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { captureException } from 'houseninja/utils/sentry';
import { inputValidation } from 'houseninja/utils/components/input-validation';
import { formatPhoneNumber } from 'houseninja/utils/components/formatting';
import { TrackedObject } from 'tracked-built-ins';

import type IntercomService from 'houseninja/services/intercom';
import type RouterService from '@ember/routing/router-service';
import type ViewService from 'houseninja/services/view';
import type { FieldSet } from 'houseninja/app/components';
import type User from 'houseninja/models/user';
import type { ModelFrom } from 'houseninja';
import type SettingsContactRoute from 'houseninja/routes/settings/contact';

type ContactInfo = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
};
type TargetId = 'firstName' | 'lastName' | 'email' | 'phoneNumber';

export default class SettingsContactController extends Controller {
  declare model: ModelFrom<SettingsContactRoute>;

  @service declare intercom: IntercomService;
  @service declare router: RouterService;
  @service declare view: ViewService;

  @tracked formIsInvalid = true;
  contactInfo: ContactInfo = new TrackedObject({
    firstName: this.model.firstName,
    lastName: this.model.lastName,
    phoneNumber: this.model.phoneNumber,
    email: this.model.email,
  });
  @tracked fields: FieldSet = [
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
  resetForm(): void {
    this.contactInfo.firstName = this.model.firstName;
    this.contactInfo.lastName = this.model.lastName;
    this.contactInfo.phoneNumber = this.model.phoneNumber;
    this.contactInfo.email = this.model.email;
    this.formIsInvalid = true;
  }

  @action
  async saveAction(): Promise<void> {
    this.model.setProperties(this.contactInfo as Pick<User, keyof User>);
    if (this.model.get('hasDirtyAttributes')) {
      try {
        await this.model.save();
        await this.resetForm();
        this.view.transitionToPreviousRoute();
      } catch (e) {
        captureException(e as Error);
      }
    }
  }

  @action
  validateForm(e: Event): void {
    const target = <HTMLInputElement>e.target;
    const targetId: keyof ContactInfo = target.id as TargetId;
    if (targetId === 'phoneNumber') {
      this.contactInfo[targetId] = target.value.replace(/\D/g, '');
      formatPhoneNumber(target);
      const field = this.fields.find((f) => f.id === targetId);
      if (field) {
        field.value = target.value;
      }
    } else {
      this.contactInfo[targetId] = target.value;
      const field = this.fields.find((f) => f.id === targetId);
      if (field) {
        field.value = this.contactInfo[targetId];
      }
    }

    this.formIsInvalid = inputValidation(this.fields, [
      // TODO: commenting out phoneIsValid for now
      // spending too much time trying to optimize
      // 'phoneIsValid',
      'emailIsValid',
    ]).isInvalid;
  }

  @action
  openChatModal(): void {
    this.intercom.showComposer(
      'I need to make a change to my account information.'
    );
  }
}
