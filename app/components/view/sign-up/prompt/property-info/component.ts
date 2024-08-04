import Component from '@glimmer/component';
import { tracked } from 'tracked-built-ins';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { inputValidation } from 'houseninja/utils/components/input-validation';
import { captureException } from 'houseninja/utils/sentry';
import { isPresent } from '@ember/utils';
import { SignupRoute } from 'houseninja/data/enums/routes';

import CurrentService from 'houseninja/services/current';
import RouterService from '@ember/routing/router-service';
import StoreService from 'houseninja/services/store';
import Property from 'houseninja/models/property';
import { Field } from 'houseninja/app/components';
import User from 'houseninja/models/user';
import ServiceAreaModel from 'houseninja/models/service-area';

type Args = {
  property: Property;
};

type PropertyInfo = {
  streetAddress1: string;
  streetAddress2?: string;
  city: string;
  state: string;
  zipcode: string;
};

type PropertyErrors = {
  streetAddress1?: string[];
  streetAddress2?: string[];
  city?: string[];
  state?: string[];
  zipcode?: string[];
};

export default class PropertyInfoComponent extends Component<Args> {
  @service declare current: CurrentService;
  @service declare router: RouterService;
  @service declare store: StoreService;

  @tracked propertyInfo: PropertyInfo = {
    streetAddress1: '',
    streetAddress2: undefined,
    city: '',
    state: 'TX',
    zipcode: '',
  };

  @tracked errors: PropertyErrors = {
    streetAddress1: [],
    streetAddress2: [],
    city: [],
    state: [],
    zipcode: [],
  };

  @tracked formIsInvalid = true;
  @tracked isLoading = false;

  @tracked fields: Field[] = [
    {
      id: 'streetAddress1',
      required: true,
      label: 'Street Address 1',
      placeholder: '',
      value: undefined,
    },
    {
      id: 'streetAddress2',
      required: false,
      label: 'Street Address 2',
      placeholder: '(Optional)',
      value: undefined,
    },
    {
      id: 'city',
      required: true,
      label: 'City',
      placeholder: '',
      disabled: false,
      value: undefined,
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
      value: undefined,
    },
  ];

  constructor(owner: unknown, args: Args) {
    super(owner, args);

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
    this.isLoading = true;
    const serviceArea = await this.#fetchServiceArea();
    let property: Property | undefined = undefined;
    try {
      const user: User = this.store.peekFirst('user') as User;
      if (isPresent(this.args.property)) {
        property = this.args.property;
        property.setProperties({
          serviceArea,
          user,
          // ...this.propertyInfo,
          default: true,
          selected: true,
        });
      } else {
        property = this.store.createRecord('property', {
          serviceArea,
          user,
          ...this.propertyInfo,
          default: true,
          selected: true,
        });
      }
      await property?.save();
      this.router.transitionTo(SignupRoute.WalkthroughBooking);
    } catch (e) {
      this.errors = property?.errors as PropertyErrors;
      captureException(e as Error);
    } finally {
      this.isLoading = false;
    }
  }

  @action
  goBack(): void {
    this.router.transitionTo(SignupRoute.Welcome);
  }

  @action
  handleSelect(e: InputEvent): void {
    console.log(e);
  }

  @action
  validateForm(e: InputEvent): void {
    const target = e.target as HTMLInputElement;
    const targetId = target.id as keyof PropertyInfo;
    this.propertyInfo[targetId] = target.value.trim();
    const field = this.fields.find((f) => f.id === targetId);
    if (field) {
      field.value = this.propertyInfo[targetId];
    }
    this.formIsInvalid = inputValidation(this.fields, [
      'zipcodeIsValid',
    ]).isInvalid;
  }

  async #fetchServiceArea(): Promise<ServiceAreaModel | undefined> {
    const zipcode = this.propertyInfo.zipcode;
    let serviceAreas = this.store.peekAll('service-area');
    if (!isPresent(serviceAreas)) {
      serviceAreas = await this.store.query('service-area', {
        filter: { zipcode },
      });
    }
    return serviceAreas.firstObject;
  }
}
