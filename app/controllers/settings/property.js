import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { inputValidation } from 'houseninja/utils/components/input-validation';
import { Intercom } from '@capacitor-community/intercom';

export default class SettingsPropertyController extends Controller {
  @service router;
  @service view;

  @tracked formIsInvalid = true;

  @tracked propertyInfo = {
    streetAddress1: this.model.streetAddress1,
    streetAddress2: this.model.streetAddress2,
    city: this.model.city,
    state: this.model.city,
    zipcode: this.model.zipcode,
  };

  @tracked fields = [
    {
      id: 'streetAddress1',
      required: true,
      label: 'Street Address 1',
      placeholder: '',
      value: (this.model && this.model.streetAddress1) || null,
    },
    {
      id: 'streetAddress2',
      required: false,
      label: 'Street Address 2',
      placeholder: '(Optional)',
      value: (this.model && this.model.streetAddress2) || null,
    },
    {
      id: 'city',
      required: true,
      label: 'City',
      placeholder: '',
      disabled: false,
      value: (this.model && this.model.city) || null,
    },
    {
      isSelect: true,
      id: 'state',
      required: true,
      label: 'State',
      placeholder: '',
      options: [{ value: 'TX', label: 'TX', selected: true }],
      disabled: true,
      value: (this.model && this.model.state) || null,
    },
    {
      // type: 'number',
      id: 'zipcode',
      required: true,
      label: 'Zipcode',
      placeholder: '',
      value: (this.model && this.model.zipcode) || null,
    },
  ];

  @action
  resetForm() {
    if (this.model) {
      this.propertyInfo.streetAddress1 = this.model.streetAddress1;
      this.propertyInfo.streetAddress2 = this.model.streetAddress2;
      this.propertyInfo.city = this.model.city;
      this.propertyInfo.state = this.model.state;
      this.propertyInfo.zipcode = this.model.zipcode;
    }

    this.formIsInvalid = true;
  }

  @action
  validateForm(e) {
    this.propertyInfo[e.target.id] = e.target.value.trim();
    this.fields.filter((f) => f.id === e.target.id)[0].value =
      this.propertyInfo[e.target.id];

    this.formIsInvalid = inputValidation(this.fields, [
      'zipcodeIsValid',
    ]).isInvalid;
  }

  @action
  handleSelect(e) {
    console.log(e);
  }

  @action
  async showMessenger() {
    await Intercom.displayMessageComposer({
      message: 'Hello. I need to make a change to my property address.',
    });
  }
}
