import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { debug } from '@ember/debug';
import * as Sentry from '@sentry/ember';

export default class PropertyInfoComponent extends Component {
  @service current;
  @service router;
  @service store;

  @tracked propertyInfo = {
    street1: null,
    street2: null,
    city: 'Austin',
    state: 'TX',
    zipcode: null,
  };

  fields = [
    {
      id: 'street1',
      required: true,
      label: 'Street Address 1',
      placeholder: '',
      value: 'street1',
    },
    {
      id: 'street2',
      required: false,
      label: 'Street Address 2',
      placeholder: '(Optional)',
      value: 'street2',
    },
    {
      id: 'city',
      required: true,
      label: 'City',
      placeholder: '',
      disabled: true,
      value: 'city',
    },
    {
      isSelect: true,
      id: 'state',
      required: true,
      label: 'State',
      placeholder: '',
      options: [{ value: 'TX', label: 'TX', selected: true }],
      disabled: true,
      value: 'state',
    },
    {
      type: 'number',
      id: 'zipcode',
      required: true,
      label: 'Zipcode',
      placeholder: '',
      value: 'zipcode',
    },
  ];

  @action
  async savePropertyInfo() {
    try {
      let property = await this.createProperty();
      await property.save();
      let address = await this.createAddress({ property });
      await address.save();
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

  async createProperty() {
    let serviceArea = this.store.peekAll('service-area').get('firstObject');
    let user = this.current.user;
    return await this.store.createRecord('property', {
      serviceArea,
      user,
      default: true,
      selected: true,
    });
  }

  async createAddress(attributes = {}) {
    return await this.store.createRecord('address', {
      ...this.propertyInfo,
      ...attributes,
    });
  }
}
