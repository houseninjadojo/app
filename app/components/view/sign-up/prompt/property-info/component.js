import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { inputValidation } from 'houseninja/utils/components/input-validation';
import { captureException } from 'houseninja/utils/sentry';
import { isPresent } from '@ember/utils';
import { SIGNUP_ROUTE } from 'houseninja/data/enums/routes';

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

  @tracked errors = {
    streetAddress1: [],
    streetAddress2: [],
    city: [],
    state: [],
    zipcode: [],
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
      // type: 'number',
      id: 'zipcode',
      required: true,
      label: 'Zipcode',
      placeholder: '',
      value: null,
    },
  ];

  constructor() {
    super(...arguments);

    if (isPresent(this.args.property)) {
      this.propertyInfo = this.args.property.getProperties(
        'streetAddress1',
        'streetAddress2',
        'city',
        'state',
        'zipcode'
      );
      this.formIsInvalid = false;
    }
  }

  @action
  async savePropertyInfo() {
    let property;
    try {
      let user = this.store.peekFirst('user');
      if (isPresent(this.args.property)) {
        property = this.args.property;
        property.setProperties({
          // serviceArea,
          user,
          ...this.propertyInfo,
          default: true,
          selected: true,
        });
      } else {
        property = this.store.createRecord('property', {
          // serviceArea,
          user,
          ...this.propertyInfo,
          default: true,
          selected: true,
        });
      }
      await property.save();
      this.router.transitionTo(SIGNUP_ROUTE.WALKTHROUGH_BOOKING);
    } catch (e) {
      this.errors = property?.errors;
      captureException(e);
    }
  }

  @action
  goBack() {
    this.router.transitionTo(SIGNUP_ROUTE.WELCOME);
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
