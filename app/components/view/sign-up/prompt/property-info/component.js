import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { debug } from '@ember/debug';
import { inputValidation } from 'houseninja/utils/components/input-validation';
import * as Sentry from '@sentry/ember';

export default class PropertyInfoComponent extends Component {
  @service current;
  @service router;
  @service store;

  @tracked propertyInfo = {
    streetAddress1: null,
    streetAddress2: null,
    city: null,
    state: 'TX',
    zipcode: null,
  };

  @tracked formIsInvalid = true;

  @tracked fields = [
    {
      id: 'streetAddress1',
      required: true,
      label: 'Street Address 1',
      placeholder: '',
      value: null,
    },
    {
      id: 'streetAddress2',
      required: false,
      label: 'Street Address 2',
      placeholder: '(Optional)',
      value: null,
    },
    {
      id: 'city',
      required: true,
      label: 'City',
      placeholder: '',
      disabled: false,
      value: null,
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
      type: 'number',
      id: 'zipcode',
      required: true,
      label: 'Zipcode',
      placeholder: '',
      value: null,
    },
  ];

  @action
  async savePropertyInfo() {
    try {
      let serviceArea = this.store.peekAll('service-area').get('firstObject');
      let user = this.store.peekAll('user').get('firstObject');
      let property = await this.store.createRecord('property', {
        serviceArea,
        user,
        ...this.propertyInfo,
        default: true,
        selected: true,
      });
      await property.save();
      this.router.transitionTo('signup.walkthrough-booking');
    } catch (e) {
      debug(e);
      Sentry.captureException(e);
    }
  }

  @action
  goBack() {
    this.router.transitionTo('signup.welcome');
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
}
