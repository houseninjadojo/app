import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { debug } from '@ember/debug';
import { inputValidation } from 'houseninja/utils/components/input-validation';
import * as Sentry from '@sentry/ember';

export default class SettingsPropertyController extends Controller {
  @service router;

  @tracked formIsInvalid = true;

  @tracked propertyInfo = {
    streetAddress1: this.model.streetAddress1,
    streetAddress2: this.model.streetAddress2,
    city: this.model.city,
    state: 'TX',
    zipcode: this.model.zipcode,
  };

  @tracked fields = [
    {
      id: 'streetAddress1',
      required: true,
      label: 'Street Address 1',
      placeholder: '',
      value: this.model.streetAddress1,
    },
    {
      id: 'streetAddress2',
      required: false,
      label: 'Street Address 2',
      placeholder: '(Optional)',
      value: this.model.streetAddress2,
    },
    {
      id: 'city',
      required: true,
      label: 'City',
      placeholder: '',
      disabled: false,
      value: this.model.city,
    },
    {
      isSelect: true,
      id: 'state',
      required: true,
      label: 'State',
      placeholder: '',
      options: [{ value: 'TX', label: 'TX', selected: true }],
      disabled: true,
      value: 'TX',
    },
    {
      // type: 'number',
      id: 'zipcode',
      required: true,
      label: 'Zipcode',
      placeholder: '',
      value: this.model.zipcode,
    },
  ];

  @action
  reset() {
    this.propertyInfo.streetAddress1 = this.model.streetAddress1;
    this.propertyInfo.streetAddress2 = this.model.streetAddress2;
    this.propertyInfo.city = this.model.city;
    this.propertyInfo.state = 'TX';
    this.propertyInfo.zipcode = this.model.zipcode;
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

    console.log(inputValidation(this.fields, ['zipcodeIsValid']));
  }

  @action
  async saveAction() {
    if (this.model.hasDirtyAttributes) {
      try {
        await this.model.save();
        this.router.transitionTo('settings.index');
      } catch (e) {
        debug(e);
        Sentry.captureException(e);
      }
    }
  }
}
